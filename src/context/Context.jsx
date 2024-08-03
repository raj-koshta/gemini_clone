import { createContext, useState } from "react";
import run from "../congif/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord)=>{
        setTimeout(()=>{
            setResultData(prev =>prev+nextWord);
        },5*index)
    }

    const newChat = ()=>{
        setLoading(false);
        setShowResult(false);
        setResultData("")
    }

    const onSent = async (prompt) => {

        setLoading(true);
        setResultData("");
        setTimeout(()=>{}, 2000);
        setShowResult(true);
        let response=null;
        if(prompt != undefined){
            response = await run(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompt(prev=>[...prev,input]);
            setRecentPrompt(input);
            response = await run(input);
        }
        let responseArray = response.split("**");
        let newResponse = "";
        for(let i = 0; i < responseArray.length; i++){
            if(i == 0 || i%2 != 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>"+ responseArray[i] + "</b>";
                // newResponse += responseArray[i];
            }
        }

        let newResponse2 = newResponse.split("*").join("<br />");
        let newResponseArray = newResponse2.split(" ");
        for(let i =0; i< newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
        setInput("");

    }

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider