document.addEventListener("DOMContentLoaded", () => {
    const studentsContainer = document.getElementById("students-container");
    const addStudentButton = document.getElementById("add_student");
    const newScoreInput = document.getElementById("new_score");
    function fetchStudents() {
        fetch("db.json")
            .then((response) => response.json())
            .then((data) => {
                studentsContainer.innerHTML = "";
                data.masai.forEach((student) => {
                    createStudentCard(student);
                });
            })
            .catch((error) => console.error(error));
    }

    function createStudentCard(student) {
        const studentCard = document.createElement("div");
        studentCard.classList.add("student");

        const nameElement = document.createElement("h3");
        nameElement.textContent = student.name;

        const scoreElement = document.createElement("p");
        scoreElement.classList.add("student_score");
        scoreElement.textContent = student.score;

        const batchElement = document.createElement("p");
        batchElement.textContent = `Batch: ${student.batch}`;

        const sectionElement = document.createElement("p");
        sectionElement.textContent = student.section;

        const updateButton = document.createElement("button");
        updateButton.classList.add("update_score");
        updateButton.textContent = "Update Score";

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove_student");
        removeButton.textContent = "Remove Student";

        studentCard.appendChild(nameElement);
        studentCard.appendChild(scoreElement);
        studentCard.appendChild(batchElement);
        studentCard.appendChild(sectionElement);
        studentCard.appendChild(updateButton);
        studentCard.appendChild(removeButton);

        studentsContainer.appendChild(studentCard);

        updateButton.addEventListener("click", () => {
            enableUpdateScoreInput(student, scoreElement);
        });

        removeButton.addEventListener("click", () => {
            removeStudent(student, studentCard);
        });
    }

    function addStudent() {
        const nameInput = document.getElementById("name");
        const batchInput = document.getElementById("batch");
        const sectionInput = document.getElementById("section");
        const evalScoreInput = document.getElementById("eval_score");

        const newStudent = {
            name: nameInput.value,
            batch: batchInput.value,
            section: sectionInput.value,
            score: parseInt(evalScoreInput.value), 
        };

        fetch("/masai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newStudent),
        })
            .then(() => {
                nameInput.value = "";
                batchInput.value = "";
                sectionInput.value = "";
                evalScoreInput.value = "";
                fetchStudents();
            })
            .catch((error) => console.error(error));
    }
    function enableUpdateScoreInput(student, scoreElement) {
        newScoreInput.value = student.score;
        newScoreInput.removeAttribute("disabled");
        newScoreInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                updateStudentScore(student, scoreElement);
            }
        });
    }
    function updateStudentScore(student, scoreElement) {
        const updatedScore = parseInt(newScoreInput.value);
        fetch(`/masai/${student.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score: updatedScore }),
        })
            .then(() => {
            
                newScoreInput.setAttribute("disabled", "true");
                scoreElement.textContent = updatedScore;
                newScoreInput.value = "";
            })
            .catch((error) => console.error(error));
    }

    function removeStudent(student, studentCard) {
        fetch(`/masai/${student.id}`, {
            method: "DELETE",
        })
            .then(() => {
                studentCard.remove();
            })
            .catch((error) => console.error(error));
    }

    addStudentButton.addEventListener("click", addStudent);
    fetchStudents();
});
