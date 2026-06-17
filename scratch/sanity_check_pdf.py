import sys
from fpdf import FPDF

print("FPDF imported successfully!")
pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", size=12)
pdf.cell(0, 10, "Sanity Check Passed", ln=1)
pdf.output("sanity_test.pdf")
print("PDF created successfully!")
