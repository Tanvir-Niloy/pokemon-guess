import React, { useState, useEffect } from "react";
import pokeMonData from "./data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	const [score, setScore] = useState(0);
	const [isStart, setisStart] = useState(true);
	const [correctAnswer, setCorrectAnswer] = useState({
		name: "",
		img: "",
	});
	const [isBegin, setisBegin] = useState(false);
	const [allOptions, setAllOptions] = useState([]);
	const [radioValue, setRadioValue] = useState("");

	const URL = "https://pokeapi.co/api/v2/pokemon/";
	const OPTIONS_COUNT = 4;
	const resetBoard = () => {
		setisBegin(false);
		setCorrectAnswer({
			name: "",
			img: "",
		});
		setRadioValue("");
		setAllOptions([]);
	};

	useEffect(() => {
		if (isBegin && allOptions.length === 0) {
			let answers = [];
			let score = 0;
			if (localStorage.getItem("score")) {
				score = localStorage.getItem("score");
			}
			for (let index = 0; index < OPTIONS_COUNT; index++) {
				let selected =
					pokeMonData[Math.floor(Math.random() * pokeMonData.length)];
				while (answers.includes(selected)) {
					selected =
						pokeMonData[
							Math.floor(Math.random() * pokeMonData.length)
						];
				}
				answers.push(selected);
			}
			fetch(URL + answers[Math.floor(Math.random() * OPTIONS_COUNT)])
				.then((res) => res.json())
				.then((data) => {
					setCorrectAnswer({
						name: data.name,
						img: data.sprites.front_default,
					});
				})
				.catch((error) => {
					if (window.confirm("There is Some Error while Loading")) {
						resetBoard();
					}
				});
			setScore(score);
			setisStart(false);
			setAllOptions(answers);
		}
	}, [score, correctAnswer, allOptions, isBegin]);

	const checkAnswer = () => {
		let dummyscore = parseInt(score);
		if (!radioValue) {
			toast.warning("Please Select Some Options");
		} else if (correctAnswer.name === radioValue) {
			toast.success("Correct Answer ! I think you are true pokemon fan 😃 ");
			localStorage.setItem("score", dummyscore + 1);
			resetBoard();
		} else if (correctAnswer.name === "") {
			toast.info("Please Wait The Image is Still Loading");
		} else {
			toast.error("Wrong Answer ! wtf what type of pokemon fan you are 😒");
		}
	};

	const onRadioChange = (name) => {
		setRadioValue(name);
	};

	return (
		
		<>
		 <ToastContainer position="top-right"/>
		<div className='form'>
			<span className='score'>Score : {score}</span>
			{!isBegin ? (
				<div className={"flex-center"}>
					<button
						className='btnSubmit'
						onClick={() => setisBegin(true)}
					>
						{isStart ? "Start Quiz" : "Go to Next"}
					</button>
				</div>
			) : (
				<>
			
			<h2>Guess The Pokemon Name <span><img style={{height:'50px',width:'50px',alignItems:'center'}} src="https://www.freeiconspng.com/thumbs/pokeball-png/pokeball-transparent-png-2.png" alt="" /></span></h2>
					<div className='image'>
						{correctAnswer.img ? (
							<img
								src={correctAnswer.img}
								alt={correctAnswer.name}
							/>
						) : (
							<div className='container'>
								<div className='box1'></div>
								<div className='box2'></div>
								<div className='box3'></div>
							</div>
						)}
					</div>
					<div className='pokemon'>
						{allOptions.map((element, i) => {
							return (
								<div
									key={i}
									className={
										element === radioValue
											? "active inputGroup"
											: "inputGroup"
									}
								>
									<label htmlFor={i}> {element}</label>
									<input
										type='radio'
										id={i}
										value={element}
										checked={element === radioValue}
										onChange={() => onRadioChange(element)}
									/>
								</div>
							);
						})}
					</div>
					<button className='btnSubmit' onClick={checkAnswer}>
						Check Answer
					</button>
				</>
			)}
		</div>
		</>
	);
};

export default App;
