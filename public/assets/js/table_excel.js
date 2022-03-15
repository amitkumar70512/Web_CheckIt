function downloadCSV(csv, filename) {
  var csvfile;
  var downloadLink;

  csvfile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvfile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  console.log("insie donwload csv fun");
}

function exportTableCSV(filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td,th");
    for (var j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }
    csv.push(row.join(","));
  }
  // download csv file
  console.log(csv);
  downloadCSV(csv.join("\n"), filename);
  console.log("insie export tablecsb");
}

///////

document.getElementById("click_loading").addEventListener("click", () => {
  console.log("click btn is clicked");
  document.getElementById("qr_animated").style.display = "block";
});
