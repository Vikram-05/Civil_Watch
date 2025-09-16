import React, { useState } from 'react';
import './ai.css';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';
import a from '../../../public/aiIcon.png';
import Markdown from 'react-markdown'

function Ai() {
    const [question, setQuestion] = useState('');
    const [questionList, setQuestionList] = useState([{ que: '', ans: '', loading: true }]);


    const systemInstruction = {
        role: 'system',
        content: `
        
        You are an expert AI that answers questions in an organized, structured, and visually appealing way. 
        Your responses should be:
        use some emoji as a respone for attraction also
        
        1. **Pointwise**: Break down the answer into clear, concise bullet points or numbered lists.
        2. **Title & Subtitle**: Use a title for the main idea, and provide additional subtitles for each section. 
        3. **Decorative Styling**: Format the text in a decorative way:
            - Use **bold** for important concepts, keywords, or titles.
            - Use *italics* for emphasis or to highlight examples.
            - Use **emoji** to add visual appeal and make the text more engaging.
        4. **Clear Hierarchy**: Structure your response with headings and subheadings for better readability.
        5. **Consistency**: Maintain a clean, well-organized structure throughout the response. 
        6. **Concise but Informative**: Be direct and to the point, but ensure that each point is informative.
    
        Example of how you should format the response:
    
        **Title: The Importance of Learning CSS**
    
        1. **Introduction**:
            - Learning CSS is essential for designing modern web pages.
            - It allows control over the layout, colors, fonts, and more.
    
        2. **Benefits**:
            - **Improves Visual Appeal**: CSS enhances the aesthetic appeal of websites.
            - **Responsive Design**: It makes websites look good on any device, from mobiles to desktops.
            - **Accessibility**: Well-designed websites improve user experience for all users.
            
        3. **Conclusion**:
            - In conclusion, CSS is crucial for every web developer. Mastery of CSS will enhance your ability to create visually stunning and user-friendly websites.
        `
    };

    const generateAnswer = async (ques) => {
        try {
            setQuestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: prevList[prevList.length - 1].que, ans: '', loading: true },
            ]);

            const apiKey = import.meta.env.VITE_API_KEY; // Fetch API key from .env
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                systemInstruction: systemInstruction,
                data: {
                    contents: [{ parts: [{ text: ques }] }],
                },
            });

            // Fetch the answer from the API response
            const generatedAnswer = response.data.candidates[0].content.parts[0].text;
            // console.log("data : ",generatedAnswer)

            // Update the question list with the formatted answer
            setQuestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: ques, ans: generatedAnswer, loading: false },
            ]);
        } catch (error) {
            console.error('Error generating answer:', error);
            setQuestionList((prevList) => [
                ...prevList.slice(0, prevList.length - 1),
                { que: ques, ans: 'Error occurred while generating answer.', loading: false },
            ]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!question.trim()) return; // Prevent empty questions

        // Add a new item to the question list with a "loading" status
        setQuestionList((prevList) => [
            ...prevList,
            { que: question, ans: 'Loading...', loading: true },
        ]);

        generateAnswer(question);
        setQuestion(''); // Clear the input after submitting
    };

    return (
        <div className="ai_main_con">
            <div className="ai_name_con">
                <h2 className="ai_name">Eva</h2>
            </div>
            <div className={questionList.length > 1 ? 'data_con' : 'add'}>
                {questionList.length === 1 && <img src={a} alt="AI Logo" className="ai_logo_a" />}
                {questionList.slice(1).map((item, idx) => (
                    <div className="outer_ai" key={idx}>
                        <span className="me">{item.que}</span>
                        <div className="eva">
                            <img src={a} alt="AI Icon" />
                            {item.loading ? (
                                <div className="loadership_JPIRJ">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                                <div className='asd'><Markdown >{item.ans}</Markdown></div>
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
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <BsFillSendFill onClick={handleSubmit} className="icon_ai" />
            </form>
        </div>
    );
}

export default Ai;
