const beautyQuestions = [
    {
        prompt: "Which tool is most commonly used to detangle wet hair gently?",
        options: ["Round brush", "Wide-tooth comb", "Flat iron", "Razor comb"],
        answer: "Wide-tooth comb",
    },
    {
        prompt: "What does SPF in skincare help protect against?",
        options: ["Humidity", "Sun exposure", "Makeup stains", "Hair breakage"],
        answer: "Sun exposure",
    },
    {
        prompt: "Which nail shape is known for a softly tapered tip?",
        options: ["Square", "Oval", "Almond", "Flat"],
        answer: "Almond",
    },
    {
        prompt: "A patch test is usually done before which salon service?",
        options: ["Hair coloring", "Shampooing", "Blow dry", "Basic manicure"],
        answer: "Hair coloring",
    },
    {
        prompt: "Which product is mainly used to remove makeup at the end of the day?",
        options: ["Toner", "Cleanser", "Setting spray", "Dry shampoo"],
        answer: "Cleanser",
    },
    {
        prompt: "What is the main purpose of a heat protectant spray?",
        options: ["Add glitter", "Hold curls overnight", "Reduce heat damage", "Change hair color"],
        answer: "Reduce heat damage",
    },
    {
        prompt: "Which beauty step usually comes before moisturizer in a basic routine?",
        options: ["Cleanser", "Perfume", "Nail oil", "Hair serum"],
        answer: "Cleanser",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("quizQuestions");
    const form = document.getElementById("beautyQuizForm");
    const result = document.getElementById("quizResult");
    const scoreNode = document.getElementById("quizScore");
    const summaryNode = document.getElementById("quizSummary");
    const playerNode = document.getElementById("quizPlayerName");

    playerNode.textContent = LuxuryHub.readSession()?.name || "Guest";

    questionContainer.innerHTML = beautyQuestions
        .map(
            (question, index) => `
                <section class="quiz-question">
                    <h3>${index + 1}. ${question.prompt}</h3>
                    ${question.options
                        .map(
                            (option) => `
                                <label class="quiz-option">
                                    <input type="radio" name="question-${index}" value="${option}" required>
                                    <span>${option}</span>
                                </label>
                            `
                        )
                        .join("")}
                </section>
            `
        )
        .join("");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let score = 0;

        beautyQuestions.forEach((question, index) => {
            const selected = form.querySelector(`input[name="question-${index}"]:checked`);
            if (selected?.value === question.answer) {
                score += 1;
            }
        });

        scoreNode.textContent = String(score);
        summaryNode.textContent =
            score >= 6
                ? "Excellent. You clearly know your salon basics."
                : score >= 4
                    ? "Good score. You know the essentials and can level up from here."
                    : "Nice try. This was built for fun, so come back and improve your score.";
        result.hidden = false;
        result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
