function generateTable() {
    const stations = document.getElementById('stations').value;
    const tableBody = document.getElementById('tableBody');
    
    // Clear previous table rows
    tableBody.innerHTML = '';

    // Create rows for each station
    for (let i = 1; i <= stations; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Station ${i}</td>
            <td><input type="number" step="0.01" class="angleInput" placeholder="Enter Angle"></td>
            <td><input type="number" step="0.01" class="correctedAngleInput" disabled></td>
            <td><input type="number" step="0.01" class="bearingInput" disabled></td>
            <td><input type="number" step="0.01" class="distanceInput" placeholder="Enter Distance"></td>
            <td><input type="number" step="0.01" class="eastingInput" disabled></td>
            <td><input type="number" step="0.01" class="northingInput" disabled></td>
            <td><input type="number" step="0.01" class="eastingCorrectedInput" disabled></td>
            <td><input type="number" step="0.01" class="northingCorrectedInput" disabled></td>
        `;
        tableBody.appendChild(row);
    }
    
    document.getElementById('tableContainer').style.display = 'block';
}

function performCalculation() {
    const easting1 = parseFloat(document.getElementById('easting1').value);
    const northing1 = parseFloat(document.getElementById('northing1').value);
    const easting2 = parseFloat(document.getElementById('easting2').value);
    const northing2 = parseFloat(document.getElementById('northing2').value);
    
    const angleInputs = document.querySelectorAll('.angleInput');
    const correctedAngleInputs = document.querySelectorAll('.correctedAngleInput');
    const bearingInputs = document.querySelectorAll('.bearingInput');
    const distanceInputs = document.querySelectorAll('.distanceInput');
    const eastingInputs = document.querySelectorAll('.eastingInput');
    const northingInputs = document.querySelectorAll('.northingInput');
    const eastingCorrectedInputs = document.querySelectorAll('.eastingCorrectedInput');
    const northingCorrectedInputs = document.querySelectorAll('.northingCorrectedInput');

    let totalDistance = 0;
    let cumulativeEastingError = 0;
    let cumulativeNorthingError = 0;

    // Perform angle correction, bearing computation, and further calculations
    for (let i = 0; i < angleInputs.length; i++) {
        let observedAngle = parseFloat(angleInputs[i].value);
        let correctedAngle = observedAngle; // Add angle correction logic
        correctedAngleInputs[i].value = correctedAngle;

        let bearing = correctedAngle; // Add bearing calculation logic here
        bearingInputs[i].value = bearing;
        
        let distance = parseFloat(distanceInputs[i].value);
        totalDistance += distance;

        let deltaE = distance * Math.sin(bearing);
        let deltaN = distance * Math.cos(bearing);
        
        eastingInputs[i].value = deltaE.toFixed(2);
        northingInputs[i].value = deltaN.toFixed(2);

        // Add corrections to easting and northing
        let eastingCorrected = (easting1 + deltaE).toFixed(2);
        let northingCorrected = (northing1 + deltaN).toFixed(2);
        
        eastingCorrectedInputs[i].value = eastingCorrected;
        northingCorrectedInputs[i].value = northingCorrected;

        // Cumulative errors for closing error calculation
        cumulativeEastingError += deltaE;
        cumulativeNorthingError += deltaN;
    }

    // Calculate Closing Error
    const closingErrorEasting = cumulativeEastingError;
    const closingErrorNorthing = cumulativeNorthingError;
    const closingErrorMagnitude = Math.sqrt(Math.pow(closingErrorEasting, 2) + Math.pow(closingErrorNorthing, 2)).toFixed(2);

    // Calculate Direction of Closing Error
    const closingErrorDirection = Math.atan2(closingErrorEasting, closingErrorNorthing).toFixed(2); // in radians

    // Calculate Perimeter 
    const perimeter = totalDistance;

    // Calculate Accuracy
    const accuracy = (closingErrorMagnitude / perimeter).toFixed(4);

    // Display results in the result section
    document.getElementById('closingError').innerHTML = `Closing Error (magnitude): ${closingErrorMagnitude} meters`;
    document.getElementById('closingErrorDirection').innerHTML = `Direction of Closing Error: ${closingErrorDirection} degrees`;
    document.getElementById('accuracy').innerHTML = `Accuracy: 1/${(1 / accuracy).toFixed(2)}`;

    // Show the result section
    document.getElementById('resultSection').style.display = 'block';
}


