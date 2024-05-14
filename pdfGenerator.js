const PDFDocument = require('pdfkit');

async function generatePDF(notes) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        // Generate PDF content here and add the documents here
        notes.forEach(note => {
            doc.text(note.tag);
            doc.text(note.description);
            doc.moveDown();
        });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.end();
    });
}

module.exports = { generatePDF };
