document.getElementById("calculateGPA").onclick = function () {
  // Get input values
  const studentName = document.getElementById("studentName").value;
  const regNo = document.getElementById("regNumber").value;
  const department = document.getElementById("department").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value;
  const collegeName = document.getElementById("college").value;
  const subjectsInput = document.getElementById("subjects").value;
  const creditsInput = document.getElementById("credits").value;
  const gradesInput = document.getElementById("grades").value;

  // Split input values into arrays
  const subjectsArray = subjectsInput.split(",");
  const creditsArray = creditsInput.split(" ");
  const gradesArray = gradesInput.split(" ");

  // Check if inputs are valid
  if (
    subjectsArray.length !== creditsArray.length ||
    subjectsArray.length !== gradesArray.length ||
    subjectsArray.includes("") ||
    creditsArray.includes("") ||
    gradesArray.includes("")
  ) {
    alert("Please enter valid data for all subjects, credits, and grades.");
    return;
  }

  let totalCredits = 0;
  let totalPoints = 0;

  const outputBody = document.getElementById("outputBody");
  outputBody.innerHTML = "";

  for (let i = 0; i < subjectsArray.length; i++) {
    const subject = subjectsArray[i];
    const credits = parseInt(creditsArray[i], 10);
    const grade = gradesArray[i].toUpperCase();

    if (isNaN(credits) || credits <= 0 || credits > 10) {
      alert(
        `Invalid credits entered for subject '${subject}'. Please enter a number between 1 and 10.`
      );
      return;
    }

    let points;
    switch (grade) {
      case "O":
        points = 10;
        break;
      case "A+":
        points = 9;
        break;
      case "A":
        points = 8;
        break;
      case "B+":
        points = 7;
        break;
      case "B":
        points = 6;
        break;
      case "C":
        points = 5;
        break;
      case "F":
        points = 0;
        break;
      default:
        alert(`Invalid grade '${grade}' for subject '${subject}'.`);
        return;
    }

    const product = credits * points;
    totalCredits += credits;
    totalPoints += product;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${i + 1}</td>
        <td>${subject}</td>
        <td>${credits}</td>
        <td>${grade}</td>
        <td>${points}</td>
        <td>${product}</td>
        <td>${((product / (credits * 10)) * 100).toFixed(2)}%</td>
      `;
    outputBody.appendChild(row);
  }

  let gpa = totalPoints / totalCredits;
  if (gpa > 10) {
    gpa = 10; // Ensure GPA is within the range of 0 to 10
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `Calculated GPA is: ${gpa.toFixed(2)} out of 10`;

  const outputTable = document.getElementById("outputTable");
  outputTable.style.display = "block";

  if (gpa >= 7.5) {
    playCelebrationAnimation(); // Start celebration animation
  }

  // Save data to localStorage
  localStorage.setItem("subjects", subjectsInput);
  localStorage.setItem("credits", creditsInput);
  localStorage.setItem("grades", gradesInput);
};

document.getElementById("toPdf").onclick = function () {
  const studentName = document.getElementById("studentName").value;
  const regNo = document.getElementById("regNumber").value;
  const department = document.getElementById("department").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value;
  const collegeName = document.getElementById("college").value;
  const outputTable = document.getElementById("outputTable").outerHTML;
  const result = document.getElementById("result").innerHTML;

  const data = `
      <h1>Student Details:</h1>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Registration Number:</strong> ${regNo}</p>
      <p><strong>Department:</strong> ${department}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Semester:</strong> ${semester}</p>
      <p><strong>College Name:</strong> ${collegeName}</p>
      <h1>Result Table:</h1>
      ${outputTable}
      <h1>GPA Score:</h1>
      <p>${result}</p>
    `;

  const opt = {
    margin: 1,
    filename: "GPA.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Generate PDF
  html2pdf().from(data).set(opt).save();
};

document.getElementById("toCsv").onclick = function () {
  const studentName = document.getElementById("studentName").value;
  const regNo = document.getElementById("regNumber").value;
  const department = document.getElementById("department").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value;
  const collegeName = document.getElementById("college").value;
  const subjectsInput = document.getElementById("subjects").value;
  const creditsInput = document.getElementById("credits").value;
  const gradesInput = document.getElementById("grades").value;
  const gpa = document.getElementById("result").innerText.split(": ")[1];

  // Split input values into arrays
  const subjectsArray = subjectsInput.split(",");
  const creditsArray = creditsInput.split(" ");
  const gradesArray = gradesInput.split(" ");

  // Check if any data is missing
  if (!subjectsArray.length || !creditsArray.length || !gradesArray.length) {
    alert("No data available to export as CSV.");
    return;
  }

  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "Student Name,Registration Number,Department,Year,Semester,College Name,Subject,Credits,Grade\n";
  for (let i = 0; i < subjectsArray.length; i++) {
    const subject = subjectsArray[i];
    const credits = creditsArray[i];
    const grade = gradesArray[i];
    csvContent += `${studentName},${regNo},${department},${year},${semester},${collegeName},${subject},${credits},${grade}\n`;
  }
  csvContent += `,,Final GPA:,,,:,${gpa}`;

  // Encode CSV content and create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "GPA.csv");
  document.body.appendChild(link);
  link.click();
};

function loadSavedData() {
  const subjectsInput = localStorage.getItem("subjects");
  const creditsInput = localStorage.getItem("credits");
  const gradesInput = localStorage.getItem("grades");

  if (subjectsInput && creditsInput && gradesInput) {
    document.getElementById("subjects").value = subjectsInput;
    document.getElementById("credits").value = creditsInput;
    document.getElementById("grades").value = gradesInput;
  }
}

function playCelebrationAnimation() {
  const animationContainer = document.getElementById("celebrationAnimation");

  if (!animationContainer) {
    console.error("Animation container not found.");
    return;
  }

  for (let i = 0; i < 50; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.style.backgroundColor = getRandomColor();
    box.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    box.style.animationDuration = `${Math.random() * 2 + 1}s`; // Random animation duration
    box.style.width = `${Math.random() * 30 + 20}px`; // Random width
    box.style.height = box.style.width; // Make height same as width for square-like appearance

    animationContainer.appendChild(box);
  }

  setTimeout(() => {
    animationContainer.innerHTML = ""; // Clear animation after 7 seconds
  }, 7000);
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Load saved data on page load
window.addEventListener("load", loadSavedData);
