import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';
import AIPImage from './assets/artificial-intelligence.png';
import ReactMarkdown from 'react-markdown';
import { Sparkles, BookOpen, Bot } from "lucide-react";



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
const newModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b"
});
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
            const promptWithRole = `You are an ${role} ${teachingStyle} teaching to a ${selectedSemester}. ${inputText} . Format the result with markdown. `;
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
        <div className="  min-h-screen bg-gradient-to-br  from-sky-50 to-indigo-100 p-6 sm:[40rem] md:[48rem] lg:[64rem] xl:[80rem] 2xl:[96rem]">
            <div className="container  w-full mx-auto flex flex-col items-center justify-start min-h-screen">
                <section className="text-center py-12" >
                    <h1 className="text-4xl font-bold text-indigo-800 mb-4">Personal AI Teacher</h1>
                    <p className="text-lg text-gray-600 mb-6">       
                           Learn smarter, faster, and more efficiently with your intelligent tutor.
                    </p>

                </section>
                <img className="lg:w-1/7 md:w-3/6 w-2/3 mb-10 object-cover object-center rounded" alt="AI" src={AIPImage} />

                <div className="mb-4">
                    <label htmlFor="roleSelect" className="block text-xl font-medium text-gray-800 ">Choose Your Semester:</label>
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
                    <label htmlFor="predefinedPrompts" className="block text-xl font-medium text-gray-800 ">Choose a Prompt:</label>
                    <select
                        id="predefinedPrompts"
                        className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="border-2 text-gray-700  border-indigo-600 w-full md:w-[800px] h-[100px]"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Ask Me I am Your AI Teacher"
                />
                <br />
                <button className="button bg-blue-800 text-sky-700" onClick={handleRun} disabled={loading}>
                    {loading ? 'Loading...' : 'ASK'}
                </button>
                {resultText && (
                    <div className="mt-5 w-full md:w-[800px]">
                        <h2 className="text-xl text-gray-800 text-left bottom-1">Result:</h2>
                        <div className="container overflow-auto mx-auto items-center justify-center p-4 border rounded text-gray-800">
                            <ReactMarkdown>{resultText}</ReactMarkdown>
                        </div>
                    
                    </div>
                )}

            </div>
            <section className="grid md:grid-cols-4 gap-6 py-10">
            <div className="rounded-2xl shadow-md bg-white p-6">
        <Sparkles className="h-10 w-10 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2  text-gray-800">BTECH CSE </h2>
        <p className="text-gray-600 ">
 This AI tool is designed to assist BTECH CSE students in their studies, providing personalized support and resources to enhance their learning experience.
        </p>
      </div>
      {/* Card 1 */}
      <div className="rounded-2xl shadow-md bg-white p-6">
        <Sparkles className="h-10 w-10 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2  text-gray-800">Instant Answers</h2>
        <p className="text-gray-600 ">
          Get clear explanations to your questions in seconds — 24/7.
        </p>
      </div>

      {/* Card 2 */}
      <div className="rounded-2xl shadow-md bg-white p-6">
        <BookOpen className="h-10 w-10 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2  text-gray-800">Interactive Lessons</h2>
        <p className="text-gray-600">
          Personalized content tailored to your learning style and speed.
        </p>
      </div>

      {/* Card 3 */}
      <div className="rounded-2xl shadow-md bg-white p-6">
        <Bot className="h-10 w-10 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2  text-gray-800">AI Chat Assistant</h2>
        <p className="text-gray-600">
          Chat with your AI tutor just like talking to a real teacher.
        </p>
      </div>
    </section>
            <footer className="ext-center text-sm text-gray-500 mt-16">
                    <p className="mt-5 text-gray-600 text-sm">
                    Developed by Jayanta Chungkrang
                    <a href="https://github.com/Jayanta111" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/jayanta-chungkrang-a94818193" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                        LinkedIn
                    </a>
               { }
                </p>
                </footer>
        </div>
    );
}

export default App;