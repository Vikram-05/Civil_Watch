
import React, { useState } from 'react';
import './ai.css';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';
import a from '../../../public/aiIcon.png';

function Ai() {
    const [question, setquestion] = useState('');
    const [questionList, setquestionList] = useState([{ que: '', ans: '', loading: false }]);

    const generateAnswer = async (ques) => {
        try {
            setquestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: prevList[prevList.length - 1].que, ans: '', loading: true },
            ]);

            const response = await axios({
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA3GrV94CRxUc9uEY2cvaFxEGQuCAFIygo',
                method: 'post',
                data: {
                    contents: [{ parts: [{ text: ques }] }],
                },
            });

            const generatedAnswer = response.data.candidates[0].content.parts[0].text;

            setquestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: ques, ans: generatedAnswer, loading: false },
            ]);
        } catch (error) {
            console.error('Error generating answer:', error);
            // Set loading to false if an error occurs
            setquestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: ques, ans: 'Error occurred while generating answer.', loading: false },
            ]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setquestionList((prevList) => [
            ...prevList,
            { que: question, ans: 'Loading...', loading: true },
        ]);
        generateAnswer(question);
        setquestion('');
    };

    return (
        <>
            <div className="ai_main_con">
                <div className="ai_name_con">
                    <img src={a} alt="" />
                    <h2 className="ai_name">Eva</h2>
                </div>
                <div className="data_con">
                    {questionList.slice(1).map((item, idx) => (
                        <div className="outer_ai" key={idx}>
                            <span className="me">{item.que}</span>
                            <div className="eva">
                                <img src={a} alt="" />
                                <span>{item.loading ? 'Loading...' : item.ans}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <form className="input_cont" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ask Questions..."
                        value={question}
                        onChange={(e) => setquestion(e.target.value)}
                    />
                    <BsFillSendFill onClick={handleSubmit} className="icon_ai" />
                </form>
            </div>
        </>
    );
}

export default Ai;
