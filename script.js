document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#winners-table tbody');

    // Fetch the winner data from the JSON file
    fetch('winners.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Clear any existing placeholder content
            tableBody.innerHTML = '';

            // Check if data is empty
            if (data.length === 0) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 3;
                cell.textContent = 'No winners yet. Be the first!';
                cell.style.textAlign = 'center';
                row.appendChild(cell);
                tableBody.appendChild(row);
                return;
            }

            // Populate the table with winner data
            data.forEach(winner => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = winner.name;
                row.appendChild(nameCell);

                const weekCell = document.createElement('td');
                weekCell.textContent = winner.week;
                row.appendChild(weekCell);

                const seriesCell = document.createElement('td');
                seriesCell.textContent = winner.series;
                row.appendChild(seriesCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing winners data:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: red;">
                        Could not load winner data.
                    </td>
                </tr>`;
        });
});
