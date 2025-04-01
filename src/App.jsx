import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';
import AIPImage from './assets/artificial-intelligence.png';
import ReactMarkdown from 'react-markdown';

function App() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [predefinedPrompts,] = useState([
        "Explain the basics:",
        "Give me a detailed explanation:",
        "Provide a practical example:",
        "What are the applications?",
        "Summarize the key points:",
    ]);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [role, setRole] = useState("You are a Computer Science and Engineering Lecture/Teacher also expert");
    const [teachingStyle, setTeachingStyle] = useState("teaching students as an expert according to their semester");
    const [selectedSemester, setSelectedSemester] = useState("1st");

    useEffect(() => {
        const initModel = async () => {
            try {
                const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Access API key from environment variables
                if (!apiKey) {
                    console.error('API key not found in environment variables.');
                    setResultText('API key not found. Please configure it.');
                    return;
                }
                const genAI = new GoogleGenerativeAI(apiKey);
                const newModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                setModel(newModel);
            } catch (error) {
                console.error('Error initializing model:', error);
                setResultText('An error occurred during initialization.');
            }
        };
        initModel();
    }, []);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleRun = async () => {
        if (!model) return;

        setLoading(true);
        try {
            const promptWithRole = `You are an ${role} ${teachingStyle} teaching to a ${selectedSemester}. ${inputText} . Format the result with markdown.`;
            const chatSession = model.startChat({
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 650536,
                },
                history: [],
            });

            const result = await chatSession.sendMessage(promptWithRole);
            setResultText(result.response.text());
        } catch (error) {
            console.error('Error running Gemini API:', error);
            setResultText('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handlePromptSelect = (prompt) => {
        setInputText(prompt);
        setSelectedPrompt(prompt);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-y-auto p-4">
            <div className="container mx-auto flex flex-col items-center justify-start min-h-screen">
                <section className="flex items-center justify-center pt-8" >
                    <h1 className="text-gray-950 dark:text-white text-xl body-font">Personal AI Teacher</h1>
                </section>
                <img className="lg:w-1/7 md:w-3/6 w-2/3 mb-10 object-cover object-center rounded" alt="AI" src={AIPImage} />

                <div className="mb-4">
                    <label htmlFor="roleSelect" className="block text-xl font-medium text-gray-950 dark:text-white ">Choose Your Semester:</label>
                    <select
                        id="roleSelect"
                        className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedSemester}
                        style={{ color: 'black', background: 'white' }}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option className="text-black" value="1st">Semester-1st</option>
                        <option className="text-black" value="2nd">Semester-2nd</option>
                        <option className="text-black" value="3rd">Semester-3rd</option>
                        <option className="text-black" value="4th">Semester-4th</option>
                        <option className="text-black" value="5th">Semester-5th</option>
                        <option className="text-black" value="6th">Semester-6th</option>
                        <option className="text-black" value="7th">Semester-7th</option>
                        <option className="text-black" value="8th">Semester-8th</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="predefinedPrompts" className="block text-xl font-medium text-gray-950 dark:text-white ">Choose a Prompt:</label>
                    <select
                        id="predefinedPrompts"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedPrompt}
                        onChange={(e) => handlePromptSelect(e.target.value)}
                    >
                        <option className="text-lg py-2 text-black block w-full rounded-md" value="">Select a prompt...</option>
                        {predefinedPrompts.map((prompt, index) => (
                            <option key={index} value={prompt} className="text-base py-2 hover:bg-gray-100 text-black">
                                {prompt}
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    className="border-2 border-indigo-600 w-full md:w-[800px] h-[100px]"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Ask Me I am Your AI"
                />
                <br />
                <button className="button bg-blue-800 text-sky-400" onClick={handleRun} disabled={loading}>
                    {loading ? 'Loading...' : 'ASK'}
                </button>
                {resultText && (
                    <div className="mt-5 w-full md:w-[800px]">
                        <h2 className="text-xl text-left bottom-1">Result:</h2>
                        <div className="container overflow-auto mx-auto items-center justify-center p-4 border rounded">
                            <ReactMarkdown>{resultText}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;