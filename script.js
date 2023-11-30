document.addEventListener("DOMContentLoaded", function () {
  const quizContainer = document.querySelector('.quiz-container');
  const questionContainer = document.getElementById('question');
  const answerContainer = document.getElementById('answers');
  const nextButton = document.getElementById('next-btn');
  const resultContainer = document.getElementById('result');

  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let questionData;

  function fetchQuizData() {
      fetch('https://opentdb.com/api.php?amount=10&type=multiple') // Fetching 10 questions
          .then(response => response.json())
          .then(data => {
              if (data.results.length > 0) {
                  questionData = data.results[currentQuestionIndex];
                  loadQuestion(questionData);
              } else {
                  quizContainer.innerHTML = "<p>No quiz data available. Please try again later.</p>";
              }
          })
          .catch(error => {
              console.error('Error fetching quiz data:', error);
              quizContainer.innerHTML = "<p>Failed to fetch quiz data. Please try again later.</p>";
          });
  }

  function loadQuestion(questionData) {
      questionContainer.innerHTML = questionData.question;

      const shuffledAnswers = shuffleArray(questionData.incorrect_answers.concat(questionData.correct_answer));
      answerContainer.innerHTML = '';

      shuffledAnswers.forEach(answer => {
          const button = document.createElement('button');
          button.textContent = answer;
          button.addEventListener('click', () => selectAnswer(answer));
          answerContainer.appendChild(button);
      });

      nextButton.style.display = 'none';
      resultContainer.style.display = 'none';
  }

  function selectAnswer(userAnswer) {
      const isCorrect = userAnswer === questionData.correct_answer;
      resultContainer.textContent = isCorrect ? 'Correct! 🌟' : 'Wrong! 😢';
      resultContainer.style.color = isCorrect ? '#2ecc71' : '#e74c3c';
      resultContainer.style.display = 'block';

      if (isCorrect) {
          correctAnswers++;
      }

      if (currentQuestionIndex < 9) {
          nextButton.style.display = 'block';
      } else {
          showFinalResult();
      }
  }

  function showFinalResult() {
      resultContainer.innerHTML = `<p>You've completed the quiz!</p><p>Your score: ${correctAnswers}/10</p>`;
      nextButton.style.display = 'none';
  }

  function nextQuestion() {
      resultContainer.style.display = 'none';
      nextButton.style.display = 'none';

      if (currentQuestionIndex < 9) {
          currentQuestionIndex++;
          fetchQuizData();
      } else {
          showFinalResult();
      }
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  fetchQuizData();

  nextButton.addEventListener('click', nextQuestion);
});
