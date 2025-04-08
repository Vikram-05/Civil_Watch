

import React, { useState } from 'react';
import './ai.css';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';
import a from '../../../public/aiIcon.png';

function Ai() {
    const [question, setquestion] = useState('');
    const [questionList, setquestionList] = useState([]); // Initialize as an empty array

    const generateAnswer = async (ques) => {
        try {
            setquestionList((prevList) => [
                ...prevList,
                { que: ques, ans: 'Loading...', loading: true, points: [] }, // Initialize points as empty
            ]);

            const response = await axios({
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA3GrV94CRxUc9uEY2cvaFxEGQuCAFIygo', // REPLACE WITH YOUR ACTUAL API KEY (MOVE TO BACKEND!)
                method: 'post',
                data: {
                    contents: [{ parts: [{ text: ques }] }],
                },
            });

            const generatedAnswer = response.data.candidates[0].content.parts[0].text;
            const answerPoints = generatedAnswer.split('\n').filter(point => point.trim() !== ''); // Split by newline and remove empty lines

            setquestionList((prevList) =>
                prevList.map((item) =>
                    item.que === ques
                        ? { ...item, ans: generatedAnswer, loading: false, points: answerPoints }
                        : item
                )
            );
        } catch (error) {
            console.error('Error generating answer:', error);
            setquestionList((prevList) =>
                prevList.map((item) =>
                    item.que === ques
                        ? { ...item, ans: 'Error occurred while generating answer.', loading: false, points: [] }
                        : item
                )
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setquestionList((prevList) => [
            ...prevList,
            { que: question, ans: 'Loading...', loading: true, points: [] },
        ]);
        generateAnswer(question);
        setquestion('');
    };

    return (
        <>
            <div className="ai_main_con">
                <div className="ai_name_con">
                    <img src={a} alt="AI Icon" /> {/* Added alt text for accessibility */}
                    <h2 className="ai_name">Eva</h2>
                </div>
                <div className="data_con">
                    {questionList.map((item, idx) => (
                        <div className="outer_ai" key={idx}>
                            <span className="me">{item.que}</span>
                            <div className="eva">
                                <img src={a} alt="AI Icon" /> {/* Added alt text for accessibility */}
                                {item.loading ? (
                                    <span>Loading...</span>
                                ) : item.points.length > 0 ? (
                                    <ul className="answer_points">
                                        {item.points.map((point, index) => (
                                            <li key={index}>
                                                <span className="point_icon">✅</span> {/* Checkmark Icon */}
                                                {point.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>{item.ans}</span>
                                )}
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


