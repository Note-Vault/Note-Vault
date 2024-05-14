console.log("Public script file")
function openUpdateModal(noteId) {
    // Find the modal element by its ID
    if(noteId === 'add-note-modal'){
      const modal = document.getElementById(noteId);
      modal.style.display = "block";
    }
    else{
      const modal = document.getElementById(`updateModal${noteId}`);
      // Open the modal
      modal.style.display = "block";
    }
  }
  
function closeUpdateModal(noteId) {
    // Find the modal element by its ID
    if(noteId === 'add-note-modal'){
      const modal = document.getElementById(noteId);
      // Close the modal
      modal.style.display = "none";
    }
    else{
      const modal = document.getElementById(`updateModal${noteId}`);
      // Close the modal
      modal.style.display = "none";
    }
}
// Add event listener for download button click
document.getElementById('downloadPdfButton').addEventListener('click', async () => {
    try {
        // Send a request to the server to initiate PDF download
        const response = await fetch('/notes/pdf');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_notes.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        // Handle error
    }
});


