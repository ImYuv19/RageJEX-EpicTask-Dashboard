import sys
import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class AcademicPDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(20, 20, 20)
        self.set_auto_page_break(auto=True, margin=20)

    def normalize_text(self, text):
        cleaned = (str(text)
                   .replace("\u2013", "-")
                   .replace("\u2014", "--")
                   .replace("\u2018", "'")
                   .replace("\u2019", "'")
                   .replace("\u201c", '"')
                   .replace("\u201d", '"')
                   .replace("\u2022", "*")
                   .replace("\u2713", "Yes")
                   .replace("\u274c", "No")
                   .replace("├──", "|--")
                   .replace("└──", "`--")
                   .replace("│", "|")
                   .replace("┌", "+")
                   .replace("┐", "+")
                   .replace("└", "+")
                   .replace("┘", "+")
                   .replace("─", "-")
                   .replace("┼", "+")
                   .replace("┬", "+"))
        return super().normalize_text(cleaned)

    def header(self):
        # We start page header from page 6 (Chapter 1) onwards
        if self.page_no() > 5:
            self.set_font("Helvetica", "I", 9)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, "RageJEX EpicTask Dashboard - Academic Project Report", border=0, align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.set_draw_color(200, 200, 200)
            self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
            self.ln(5)

    def footer(self):
        # Skip footer on cover page (page 1)
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("Helvetica", "I", 9)
            self.set_text_color(128, 128, 128)
            # Center page number
            self.cell(0, 10, f"Page {self.page_no()}", border=0, align="C")

def draw_page_border(pdf):
    pdf.set_draw_color(46, 73, 115)
    pdf.set_line_width(1.0)
    pdf.rect(10, 10, pdf.w - 20, pdf.h - 20)
    # Inner border
    pdf.set_line_width(0.4)
    pdf.rect(12, 12, pdf.w - 24, pdf.h - 24)

pdf = None # global reference for helpers

def chapter_title(pdf_or_text, text=None):
    global pdf
    if text is None:
        text_content = pdf_or_text
        current_pdf = pdf
    else:
        text_content = text
        current_pdf = pdf_or_text
    current_pdf.set_font("Helvetica", "B", 18)
    current_pdf.set_text_color(24, 43, 73) # Navy
    current_pdf.cell(0, 12, text_content, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    current_pdf.ln(4)

def section_heading(pdf_or_text, text=None):
    global pdf
    if text is None:
        text_content = pdf_or_text
        current_pdf = pdf
    else:
        text_content = text
        current_pdf = pdf_or_text
    current_pdf.set_font("Helvetica", "B", 13)
    current_pdf.set_text_color(46, 73, 115) # Medium Blue
    current_pdf.cell(0, 8, text_content, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    current_pdf.ln(3)

def body_text(pdf_or_text, text=None):
    global pdf
    if text is None:
        text_content = pdf_or_text
        current_pdf = pdf
    else:
        text_content = text
        current_pdf = pdf_or_text
    current_pdf.set_font("Helvetica", size=10)
    current_pdf.set_text_color(40, 40, 40) # Off-black
    current_pdf.multi_cell(0, 5.5, text_content, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    current_pdf.ln(3)

def bullet_item(pdf_or_title, title=None, desc=None):
    global pdf
    if desc is None:
        title_content = pdf_or_title
        desc_content = title
        current_pdf = pdf
    else:
        title_content = title
        desc_content = desc
        current_pdf = pdf_or_title
    current_pdf.set_font("Helvetica", "B", 10)
    current_pdf.set_text_color(40, 40, 40)
    current_pdf.cell(8, 5.5, "-", align="C")
    current_pdf.cell(current_pdf.get_string_width(title_content) + 2, 5.5, title_content, new_x=XPos.RIGHT, new_y=YPos.TOP)
    current_pdf.set_font("Helvetica", size=10)
    current_pdf.multi_cell(0, 5.5, desc_content, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    current_pdf.ln(1.5)

def code_box(pdf_or_text, text=None):
    global pdf
    if text is None:
        text_content = pdf_or_text
        current_pdf = pdf
    else:
        text_content = text
        current_pdf = pdf_or_text
    current_pdf.set_font("Courier", size=8.5)
    current_pdf.set_text_color(50, 50, 50)
    current_pdf.set_fill_color(245, 245, 245)
    current_pdf.set_draw_color(220, 220, 220)
    current_pdf.multi_cell(0, 4.5, text_content, border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    current_pdf.ln(3)

def main():
    global pdf
    pdf = AcademicPDF()
    
    # -------------------------------------------------------------------------
    # PAGE 1: COVER PAGE
    # -------------------------------------------------------------------------
    pdf.add_page()
    draw_page_border(pdf)
    
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, "A PROJECT REPORT ON", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 15, "RageJEX EpicTask Dashboard", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, "A Modern React-Vite Project & Task Management System", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(0, 8, "with Advanced Graph Loop Checkers and Automated Workload Load Balancers", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(15)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, "Submitted in partial fulfillment of the requirements for the award of degree of", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 10, "Bachelor of Technology", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 6, "in", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 10, "Computer Science & Engineering", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(20)
    
    # Grid of Submitter and Guide
    col_width = (pdf.w - 40) / 2
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(col_width, 6, "SUBMITTED BY:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_width, 6, "UNDER THE GUIDANCE OF:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("Helvetica", size=10)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(col_width, 6, "Student Name: [STUDENT NAME]", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_width, 6, "Faculty Guide: [FACULTY NAME]", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.cell(col_width, 6, "Roll Number: [ROLL NUMBER]", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_width, 6, "Designation: [FACULTY DESIGNATION]", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.cell(col_width, 6, "Semester: [SEMESTER]", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_width, 6, "Department: Computer Science & Eng.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(25)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "[COLLEGE NAME]", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", size=10)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 6, "Affiliated to State Technical University", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(0, 6, "Submission Date: [DATE]", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # -------------------------------------------------------------------------
    # PAGE 2: CERTIFICATE PAGE
    # -------------------------------------------------------------------------
    pdf.add_page()
    draw_page_border(pdf)
    
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "[COLLEGE NAME]", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 6, "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "CERTIFICATE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    
    cert_text = (
        "This is to certify that the project report entitled 'RageJEX EpicTask Dashboard' "
        "submitted by [STUDENT NAME] (Roll No: [ROLL NUMBER]) in partial fulfillment of the requirements "
        "for the award of degree of Bachelor of Technology in Computer Science & Engineering is a record of "
        "bonafide work carried out by them under my supervision and guidance.\n\n"
        "To the best of my knowledge, the matter embodied in this project report has not been submitted "
        "to any other University or Institute for the award of any degree or diploma."
    )
    pdf.set_font("Helvetica", size=11)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 7, cert_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(35)
    # Signature columns
    sig_width = (pdf.w - 40) / 2
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(sig_width, 6, "_________________________", align="L", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(sig_width, 6, "_________________________", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.cell(sig_width, 6, "Internal Guide / Supervisor", align="L", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(sig_width, 6, "Head of Department (CSE)", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # -------------------------------------------------------------------------
    # PAGE 3: ACKNOWLEDGEMENT
    # -------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "ACKNOWLEDGEMENT", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    
    ack_text = (
        "I express my deep sense of gratitude and sincere thanks to my faculty guide, [FACULTY NAME], "
        "for their valuable guidance, constant encouragement, and constructive feedback throughout the "
        "design, development, and testing phases of the 'RageJEX EpicTask Dashboard' project.\n\n"
        "I am extremely thankful to the Head of Computer Science & Engineering Department for providing "
        "excellent lab facilities and support which made it possible to conduct research, compile packages, "
        "and complete the application code.\n\n"
        "I also extend my heartfelt thanks to the college Principal for maintaining a highly motivating "
        "academic environment, and to my parents, classmates, and friends who provided moral and technical "
        "assistance during challenging implementation hours."
    )
    pdf.set_font("Helvetica", size=11)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 7.5, ack_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(25)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 6, "[STUDENT NAME]", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", size=10)
    pdf.cell(0, 6, "Roll Number: [ROLL NUMBER]", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(0, 6, "B.Tech CSE, Semester VII", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # -------------------------------------------------------------------------
    # PAGE 4: ABSTRACT
    # -------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "ABSTRACT", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    
    abs_text = (
        "Project planning and management dashboards are pivotal tools in modern software development methodologies. "
        "However, existing tools often lack intuitive and responsive user experiences when dealing with complex "
        "hierarchical relationships, workflow milestones, task dependencies, and resource load management.\n\n"
        "This project presents the design and development of the 'RageJEX EpicTask Dashboard' – a high-fidelity, "
        "fully responsive client-side project and task management system built on React and Vite. The system "
        "incorporates several advanced algorithmic components designed to solve critical operational bottlenecks. "
        "Specifically, the application implements: (1) A recursive DFS-based Critical Path Finder that calculates the shortest "
        "project completion timeline; (2) A validation graph checker that blocks circular dependencies (deadlocks) in real time; "
        "(3) A FIFO-based Alert Organizer queue; (4) An Undo/Redo state tracker utilizing double historical stacks; "
        "(5) An automated, load-balanced Team Workload Assignor; and (6) A dynamic visual Project Template Checker.\n\n"
        "All application states, including task logs, historical state snapshots, and workload distributions, are persisted "
        "using customized reactive LocalStorage adapters. The resulting system combines lightweight client performance "
        "with an elegant, responsive UI that complies with modern SaaS architectural specifications."
    )
    pdf.set_font("Helvetica", size=11)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 7.5, abs_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # -------------------------------------------------------------------------
    # PAGE 5: TABLE OF CONTENTS
    # -------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "TABLE OF CONTENTS", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    
    def toc_line(pdf, title, page_str):
        pdf.set_font("Helvetica", "B", 10.5)
        pdf.set_text_color(40, 40, 40)
        pdf.cell(pdf.get_string_width(title) + 2, 8, title)
        dots_width = pdf.w - 40 - pdf.get_string_width(title) - pdf.get_string_width(page_str) - 8
        dots_count = int(dots_width / pdf.get_string_width("."))
        pdf.set_font("Helvetica", size=10)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(dots_width, 8, "." * dots_count, align="C")
        pdf.set_font("Helvetica", "B", 10.5)
        pdf.set_text_color(24, 43, 73)
        pdf.cell(0, 8, page_str, align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    toc_line(pdf, "1. INTRODUCTION", "6")
    toc_line(pdf, "2. SYSTEM OBJECTIVES", "7")
    toc_line(pdf, "3. TECHNOLOGY STACK SPECIFICATION", "8")
    toc_line(pdf, "4. SYSTEM ARCHITECTURE & FLOWS", "9")
    toc_line(pdf, "5. COMPONENT & REPOSITORY STRUCTURE", "10")
    toc_line(pdf, "6. MODULES IMPLEMENTATION DETAILS", "11")
    toc_line(pdf, "7. ADVANCED CASE STUDY FEATURES", "12")
    toc_line(pdf, "8. CORE ALGORITHMS AND DATA STRUCTURES", "14")
    toc_line(pdf, "9. LOCALSTORAGE DATA SCHEMAS", "16")
    toc_line(pdf, "10. USER INTERFACE SCREENSHOTS", "17")
    toc_line(pdf, "11. TESTING, VERIFICATION AND VALIDATION", "18")
    toc_line(pdf, "12. DEVELOPMENT CHALLENGES FACED", "19")
    toc_line(pdf, "13. FUTURE ENHANCEMENTS", "20")
    toc_line(pdf, "14. PROJECT CONCLUSION", "21")
    toc_line(pdf, "15. REFERENCES AND BIBLIOGRAPHY", "22")
    toc_line(pdf, "16. GITHUB REPOSITORY & LIVE DEMO", "23")

    # -------------------------------------------------------------------------
    # PAGE 6: 1. INTRODUCTION
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "1. INTRODUCTION")
    
    section_heading(pdf, "1.1 Overview")
    body_text(
        "Modern enterprise operations rely on agile, structured workflows to execute complex, multi-layered initiatives. "
        "Traditional project management systems often operate as passive record holders, failing to assist developers and "
        "managers actively. Issues such as task blockers, resource imbalances, deadline oversights, and circular dependency "
        "loops are frequently discovered late, resulting in significant scheduling delays."
    )
    
    section_heading(pdf, "1.2 Need for the Project")
    body_text(
        "There is an urgent requirement for intelligent, active client-side project dashboards. Such platforms must validate "
        "project specifications against pre-defined organizational templates, identify scheduling durations dynamically, "
        "and automatically direct workloads to the least-burdened individuals. Building these operations directly into the "
        "browser environment ensures high responsiveness, zero latency, and strict offline availability, which are vital for "
        "productivity tools."
    )
    
    section_heading(pdf, "1.3 Problem Statement")
    body_text(
        "Design and implement a single-page React application capable of managing multiple projects, nested tasks, and teams. "
        "The system must prevent critical path scheduling blockages, ensure validation compliance with template milestones, "
        "sort delay risk levels dynamically, and balance workloads in real time, while persisting all states in localStorage."
    )

    # -------------------------------------------------------------------------
    # PAGE 7: 2. OBJECTIVES
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "2. SYSTEM OBJECTIVES")
    
    body_text(
        "The system aims to achieve the following technological and functional objectives:"
    )
    
    bullet_item(pdf, "Dynamic Dependency Cycle Resolution:",
                "Detect and block circular task dependencies in real time to prevent scheduling deadlocks.")
    
    bullet_item(pdf, "Project Timeline Optimization:",
                "Calculate and display the critical path of tasks using graph algorithms to find the shortest project completion duration.")
    
    bullet_item(pdf, "Automated Workload Balancing:",
                "Incorporate a greedy resource allocation engine that assigns tasks to the team member with the lowest workload index.")
    
    bullet_item(pdf, "State History Management:",
                "Implement a double-stack based history manager enabling users to undo and redo scheduling modifications seamlessly.")
    
    bullet_item(pdf, "Compliance Checking:",
                "Build a template checker that enforces milestone audits and validates project timelines automatically.")
    
    bullet_item(pdf, "Low Latency Local Sync:",
                "Maintain complete data persistence in browser LocalStorage with reactive state updates across dashboard views.")

    # -------------------------------------------------------------------------
    # PAGE 8: 3. TECHNOLOGY STACK SPECIFICATION
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "3. TECHNOLOGY STACK SPECIFICATION")
    
    body_text(
        "The application is engineered using high-performance web technologies ensuring responsive, client-first operations:"
    )
    
    section_heading(pdf, "3.1 Core Architecture and Build Tools")
    bullet_item(pdf, "React.js (v18.3.1):",
                "Utilized for building interactive and high-speed declarative UI components. Leverages component composition and memoization.")
    bullet_item(pdf, "Vite (v6.0.5):",
                "Used as the build pipeline and development server. Offers hot module replacement (HMR) and fast Rollup-based production builds.")
    bullet_item(pdf, "React Router DOM (v6.28.0):",
                "Manages single-page client routing, transition layers, layout nesting, and protected route access control.")
    
    section_heading(pdf, "3.2 Layout, Styling, and Visualizations")
    bullet_item(pdf, "Tailwind CSS (v3.4.17):",
                "Utility-first styling system used for layout responsiveness, typography, custom theme colors, transitions, and dark/light modes.")
    bullet_item(pdf, "Lucide React:",
                "A library of clean, vector-based SVG icons utilized for visual status markers, menu navigation, and action buttons.")
    bullet_item(pdf, "Recharts (v2.15.0):",
                "SVG charting library integrated for rendering dashboard graphs (task statuses, deadline risks, workload distribution).")
    
    section_heading(pdf, "3.3 Storage and Management")
    bullet_item(pdf, "React Context API:",
                "Implements global state management across routes, handling user authentication, project datasets, tasks, activities, and undo stacks.")
    bullet_item(pdf, "LocalStorage Services:",
                "HTML5 client storage wrapper that saves system collections. Features mock seed scripts for immediate evaluations.")

    # -------------------------------------------------------------------------
    # PAGE 9: 4. SYSTEM ARCHITECTURE & FLOWS
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "4. SYSTEM ARCHITECTURE & FLOWS")
    
    body_text(
        "The system structure is designed around a single unidirectional data store (Context API) feeding reactive components. "
        "Local changes propagate down, while UI interactions trigger actions that update the store and sync to localStorage."
    )
    
    section_heading(pdf, "4.1 Data flow and Store Architecture")
    
    architecture_flow = (
        "+-----------------------------------------------------------------+\n"
        "|                       React Router / View                       |\n"
        "+-------------------------------+---------------------------------+\n"
        "                                | (Actions: Create, Edit, Toggle)\n"
        "                                v\n"
        "+-----------------------------------------------------------------+\n"
        "|                 Global Context (AppDataContext)                  |\n"
        "+-------+-----------------------+-----------------------+---------+\n"
        "        |                       |                       |\n"
        "        v (State updates)       v (Validations)         v (History Logs)\n"
        "+---------------+   +-------------------+   +---------------------+\n"
        "|  Recharts UI  |   | validators.js Graph|   | Double Stack Undo/  |\n"
        "|  Distribution |   | DFS Validation    |   | Redo Logger         |\n"
        "+---------------+   +-------------------+   +---------------------+\n"
        "        |                       |                       |\n"
        "        +-----------------------+-----------------------+\n"
        "                                | (Writes & Reads)\n"
        "                                v\n"
        "+-----------------------------------------------------------------+\n"
        "|               HTML5 LocalStorage Persistence                    |\n"
        "+-----------------------------------------------------------------+"
    )
    code_box(pdf, architecture_flow)
    
    section_heading(pdf, "4.2 Authentication Flow")
    body_text(
        "1. Login/Signup requests pass through AuthContext.\n"
        "2. Signup verifies unique email records and passwords (min 8 chars).\n"
        "3. Session details write to localStorage.currentUser.\n"
        "4. ProtectedRoute components redirect unauthorized attempts to Login page."
    )

    # -------------------------------------------------------------------------
    # PAGE 10: 5. COMPONENT & REPOSITORY STRUCTURE
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "5. COMPONENT & REPOSITORY STRUCTURE")
    
    body_text(
        "The workspace maintains clear separations of layout structures, dynamic modules, utility handlers, and context providers:"
    )
    
    dir_structure = (
        "src/\n"
        "├── assets/          # Global styles and static imagery\n"
        "├── components/      # UI components sorted by feature modules\n"
        "│   ├── auth/        # Login and registration layouts\n"
        "│   ├── common/      # Reusable controls (Button, Badge, Skeleton)\n"
        "│   ├── dashboard/   # Summary statistics cards and widgets\n"
        "│   ├── layout/      # Sidebar, Navbar, Mobile navigation\n"
        "│   ├── projects/    # TemplateChecker, TreeViews, Card views\n"
        "│   ├── tasks/       # Sorters, Filter selectors, Tables\n"
        "│   └── workload/    # Member forms, loading states\n"
        "├── context/         # AppDataContext.jsx, AuthContext.jsx\n"
        "├── hooks/           # useLocalStorage.js, useTaskFilters.js\n"
        "├── pages/           # Main route view controllers (Dashboard, Projects)\n"
        "├── routes/          # ProtectedRoute definitions\n"
        "├── services/        # storageService.js (data seeding / resets)\n"
        "└── utils/           # Math and graph algorithms (criticalPath, workload)\n"
    )
    code_box(pdf, dir_structure)

    # -------------------------------------------------------------------------
    # PAGE 11: 6. MODULES IMPLEMENTATION DETAILS
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "6. MODULES IMPLEMENTATION DETAILS")
    
    body_text(
        "The project is structured into eight core modules, each managing distinct areas of project execution:"
    )
    
    bullet_item(pdf, "Authentication Module:",
                "Handles login, registration, password validation, and secure route redirects. Checks for duplicate registration details.")
    
    bullet_item(pdf, "Dashboard Module:",
                "Presents summary widgets (Total Projects, Blocked Tasks, Deadlines at Risk) and integrates Recharts visualizations.")
    
    bullet_item(pdf, "Projects Module:",
                "Manages project records. Combines layout selectors (Cards, Trees, Tables) and contains the ProjectForm.")
    
    bullet_item(pdf, "Tasks Module:",
                "Lists tasks with columns for deadlines, priority, and assignees. Integrates sorting (by delay risk, duration) and string searching.")
    
    bullet_item(pdf, "Dependencies Module:",
                "Visualizes scheduling blocker relationships. Features a critical path panel listing tasks that determine total duration.")
    
    bullet_item(pdf, "Notifications Module:",
                "Implements a background event dispatcher and alert queue, rendering toast messages and persistent audit logs.")
    
    bullet_item(pdf, "Workload Module:",
                "Monitors staff capacity. Calculates real-time task allocations and renders a load balance chart.")
    
    bullet_item(pdf, "Settings Module:",
                "Controls display parameters (Light/Dark themes) and handles localized dataset resets.")

    # -------------------------------------------------------------------------
    # PAGE 12: 7. ADVANCED CASE STUDY FEATURES
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "7. ADVANCED CASE STUDY FEATURES")
    
    section_heading(pdf, "7.1 Task Folder Viewer")
    body_text(
        "Renders projects as collapsible tree nodes. Inside each project, tasks are displayed hierarchically. "
        "Users can expand a project folder to inspect nested task entries complete with status highlights, "
        "assignee names, and due dates, avoiding flat list complexity."
    )
    
    section_heading(pdf, "7.2 Schedule Undo/Redo Timeline")
    body_text(
        "Saves sequential project configuration snapshots. If a user modifies task parameters (e.g. changing duration), "
        "the previous state is pushed onto a history stack. Users can traverse back and forth along the timeline "
        "using dedicated header buttons, reverting or re-applying alterations immediately."
    )
    
    section_heading(pdf, "7.3 Alert Organizer (FIFO Queue)")
    body_text(
        "Accumulates notifications inside a strict First-In, First-Out (FIFO) queue. When background processes trigger alerts "
        "(e.g., project rejected, critical path updated), they are queued. The user can dispatch notifications sequentially; "
        "pressing 'Send Next' pops the head of the queue, dispatches a toast UI prompt, and logs the entry in history."
    )
    
    section_heading(pdf, "7.4 Template Checker & Milestone Validator")
    body_text(
        "Audits project configurations against specific templates (Software Release, Marketing Campaign, Product Launch). "
        "Auto-populates mandatory milestones as interactive tag chips. Computes missing requirements, visualizes compliant "
        "vs. missing items (using ✓/❌ checklists), and evaluates timeline lengths (e.g. Software template timeline must be "
        "at least 14 days) before enabling project creation."
    )
    
    pdf.add_page()
    chapter_title(pdf, "7. ADVANCED CASE STUDY FEATURES (CONTD.)")
    
    section_heading(pdf, "7.5 Deadline Risk Sorter")
    body_text(
        "Analyzes tasks to identify risk coefficients. Calculates delay factors by comparing dates with deadlines. "
        "Applies mathematical formulas to compute delay metrics, enabling managers to sort tasks descending by risk "
        "index to address bottlenecks."
    )
    
    section_heading(pdf, "7.6 Task Lock Hub")
    body_text(
        "Identifies and displays tasks stuck in a 'Blocked' status. Analyzes blockedBy dependency arrays and "
        "cross-references blocking tasks. Renders waiting tasks alongside their blockers in a dedicated "
        "visual layout, enabling managers to locate bottlenecks immediately."
    )
    
    section_heading(pdf, "7.7 Quickest Project Completion Finder")
    body_text(
        "Calculates the longest path of dependent tasks (the Critical Path). Computes task dependency adjacency chains "
        "and uses DFS to calculate total project completion timelines. Highlights critical path task chains in red, "
        "allowing managers to see which tasks cannot be delayed without impacting the project end date."
    )
    
    section_heading(pdf, "7.8 Team Workload Assignor")
    body_text(
        "Balances team workload. Analyzes team member assignments and calculates active workload scores. "
        "The project creation panel suggests the member with the lowest load, helping managers distribute "
        "tasks evenly across the team."
    )

    # -------------------------------------------------------------------------
    # PAGE 14: 8. CORE ALGORITHMS AND DATA STRUCTURES
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "8. CORE ALGORITHMS AND DATA STRUCTURES")
    
    section_heading(pdf, "8.1 Critical Path Analysis (DFS + Memoization)")
    body_text(
        "To find the critical path, the tasks and their dependency blocks are parsed into a Directed Acyclic Graph (DAG). "
        "The algorithm uses a memoized Depth-First Search (DFS) to locate the path with the maximum cumulative task duration:"
    )
    
    critical_path_algo = (
        "Algorithm CalculateCriticalPath(tasks):\n"
        "  1. Build adjacency list of dependencies: children[dependencyId] = [taskId]\n"
        "  2. Initialize memoMap = empty Map()\n"
        "  3. Define DFS(taskId):\n"
        "       if taskId in memoMap, return memoMap[taskId]\n"
        "       maxChildDuration = 0, bestPath = []\n"
        "       for childId in children[taskId]:\n"
        "         res = DFS(childId)\n"
        "         if res.duration > maxChildDuration:\n"
        "           maxChildDuration = res.duration\n"
        "           bestPath = res.path\n"
        "       currentTask = taskMap[taskId]\n"
        "       total = currentTask.duration + maxChildDuration\n"
        "       result = { duration: total, path: [currentTask] + bestPath }\n"
        "       memoMap[taskId] = result\n"
        "       return result\n"
        "  4. Find root tasks (tasks without blockers)\n"
        "  5. Evaluate roots via DFS and return path with largest cumulative duration."
    )
    code_box(pdf, critical_path_algo)
    
    section_heading(pdf, "8.2 Dependency Cycle Validation (DFS Loop Detection)")
    body_text(
        "Before adding task dependencies, the validation layer ensures no circular references are created. "
        "It uses DFS and maintains recursion stack markers to find cycles:"
    )
    
    cycle_algo = (
        "Algorithm HasCycle(taskId, proposedBlockers, allTasks):\n"
        "  1. Build adjacency mapping: adj[T] = T.blockedBy (including proposedBlockers for taskId)\n"
        "  2. Visited = empty Set(), RecursionStack = empty Set()\n"
        "  3. Define DFS(node):\n"
        "       if node in RecursionStack, return True (cycle found!)\n"
        "       if node in Visited, return False\n"
        "       Add node to Visited and RecursionStack\n"
        "       for neighbor in adj[node]:\n"
        "         if DFS(neighbor), return True\n"
        "       Remove node from RecursionStack\n"
        "       return False\n"
        "  4. Loop over all nodes: if DFS(node) is True, return True (Cycle exists)\n"
        "  5. Return False (DAG is safe)"
    )
    code_box(pdf, cycle_algo)
    
    pdf.add_page()
    chapter_title(pdf, "8. CORE ALGORITHMS (CONTD.)")
    
    section_heading(pdf, "8.3 Team Workload Balancing Logic")
    body_text(
        "Task assignments analyze active capacity metrics to balance team workloads. "
        "The auto-assignment engine calculates member load scores based on active and blocked tasks:"
    )
    
    workload_formula = (
        "Workload Score Formula:\n"
        "  Workload_Score(Member) = Count(Active_Tasks(Member)) + Count(Blocked_Tasks(Member))\n\n"
        "Selection Greedy Sorter:\n"
        "  Given Members list M, and Tasks list T:\n"
        "  1. Compute Workload_Score for each member.\n"
        "  2. Sort M ascending by Workload_Score.\n"
        "  3. If workload scores are equal, sub-sort by Total_Assigned_Tasks ascending.\n"
        "  4. Return M[0] (least-burdened member)."
    )
    code_box(pdf, workload_formula)
    
    section_heading(pdf, "8.4 Timeline Undo/Redo Dual Stacks")
    body_text(
        "The history manager uses a double-stack architecture to track project timelines. "
        "This allows users to revert or re-apply changes across configuration states:"
    )
    
    undo_redo_schema = (
        "State Structure:\n"
        "  History = { past: [State_1, State_2, ...], current: State_Active, future: [...] }\n\n"
        "Actions:\n"
        "  - PushState(newState):\n"
        "      past.push(current)\n"
        "      current = newState\n"
        "      future.clear() (invalidate forward history on new actions)\n"
        "  - Undo():\n"
        "      if past is empty, return\n"
        "      future.push(current)\n"
        "      current = past.pop()\n"
        "  - Redo():\n"
        "      if future is empty, return\n"
        "      past.push(current)\n"
        "      current = future.pop()"
    )
    code_box(pdf, undo_redo_schema)

    # -------------------------------------------------------------------------
    # PAGE 16: 9. LOCALSTORAGE DATA SCHEMAS
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "9. LOCALSTORAGE DATA SCHEMAS")
    
    body_text(
        "Application collections are saved as stringified JSON payloads in browser LocalStorage. "
        "The following schemas document the stored data formats:"
    )
    
    schema_json = (
        "// 1. Project Entity Schema\n"
        "{\n"
        "  \"id\": \"project-12345\",\n"
        "  \"name\": \"Software Platform Rollout\",\n"
        "  \"description\": \"Comprehensive enterprise infrastructure deployment.\",\n"
        "  \"owner\": \"Sophia Chen\",\n"
        "  \"milestones\": [\"Requirements\", \"Development\", \"Testing\", \"Deployment\"],\n"
        "  \"startDate\": \"2026-06-01\",\n"
        "  \"endDate\": \"2026-06-30\",\n"
        "  \"status\": \"In Progress\",\n"
        "  \"templateType\": \"Software Release\"\n"
        "}\n\n"
        "// 2. Task Entity Schema\n"
        "{\n"
        "  \"id\": \"task-67890\",\n"
        "  \"projectId\": \"project-12345\",\n"
        "  \"title\": \"Write Integration Unit Tests\",\n"
        "  \"description\": \"Author test suites matching API endpoint routes.\",\n"
        "  \"assignee\": \"Sophia Chen\",\n"
        "  \"status\": \"Blocked\", // Planning, In Progress, Blocked, Completed\n"
        "  \"priority\": \"High\",\n"
        "  \"duration\": 5, // in days\n"
        "  \"blockedBy\": [\"task-67888\"], // dependency task IDs\n"
        "  \"delayDays\": 3 // deadline risk index\n"
        "}\n\n"
        "// 3. User Credentials Schema\n"
        "{\n"
        "  \"id\": \"user-324\",\n"
        "  \"fullName\": \"Admin User\",\n"
        "  \"email\": \"admin@epictask.com\",\n"
        "  \"password\": \"adminpwd123\"\n"
        "}"
    )
    code_box(pdf, schema_json)

    # -------------------------------------------------------------------------
    # PAGE 17: 10. SCREENSHOTS
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "10. USER INTERFACE SCREENSHOTS")
    
    body_text(
        "This section lists placeholders for the application interfaces. "
        "Refer to these layouts when deploying and validating screen alignments:"
    )
    
    def screenshot_placeholder(pdf, name):
        pdf.set_draw_color(180, 180, 180)
        pdf.set_fill_color(248, 249, 250)
        pdf.rect(pdf.get_x(), pdf.get_y(), pdf.w - 40, 24, style="FD")
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.text(pdf.get_x() + 5, pdf.get_y() + 10, f"[PLACEHOLDER: {name}]")
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(150, 150, 150)
        pdf.text(pdf.get_x() + 5, pdf.get_y() + 17, "Insert actual system window grab showing layout alignments.")
        pdf.ln(28)

    screenshot_placeholder(pdf, "LOGIN SCREEN")
    screenshot_placeholder(pdf, "SIGNUP SCREEN")
    screenshot_placeholder(pdf, "DASHBOARD SCREEN")
    screenshot_placeholder(pdf, "PROJECTS TREE & FOLDER VIEWER")
    screenshot_placeholder(pdf, "TASKS TABLE VIEW")
    screenshot_placeholder(pdf, "DEPENDENCIES PATH VISUALIZER")
    screenshot_placeholder(pdf, "NOTIFICATION ALERTS HISTORY")
    screenshot_placeholder(pdf, "TEAM WORKLOAD DISTRIBUTION")

    # -------------------------------------------------------------------------
    # PAGE 18: 11. TESTING AND VALIDATION
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "11. TESTING AND VALIDATION")
    
    section_heading(pdf, "11.1 Build and Compilation Testing")
    body_text(
        "A Vite production bundle compilation was executed to verify structural validity and dependency resolution. "
        "The project builds successfully without syntax or module errors:\n"
        "  - Command: npm run build\n"
        "  - Transform Count: 2266 modules compiled successfully.\n"
        "  - Bundle Outputs: index.css (32.99 kB), index.js (719.84 kB)."
    )
    
    section_heading(pdf, "11.2 Unit & Logic Validation (Smoke Tests)")
    bullet_item(pdf, "Authentication validations:",
                "Empty fields, incorrect email formats, and passwords under 8 characters are blocked. Duplicate email registrations are rejected.")
    
    bullet_item(pdf, "Graph validation cycles:",
                "Cycle validation was tested by building a dependency chain A -> B -> C -> A. The DFS cycle validator identified the loop and blocked the assignment.")
    
    bullet_item(pdf, "Workload adjustments:",
                "Adding, renaming, or deleting team members updates workload scores. Deleting a member updates task allocations and charts immediately.")
    
    section_heading(pdf, "11.3 Interface Responsiveness")
    body_text(
        "Layouts were tested across viewport widths from 360px (mobile) to 1440px (desktop monitor grids). "
        "The collapsible sidebar transitions to an overlay drawer on mobile viewports. "
        "Flexbox elements prevent components and charts from clipping outside viewport boundaries."
    )

    # -------------------------------------------------------------------------
    # PAGE 19: 12. CHALLENGES FACED
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "12. DEVELOPMENT CHALLENGES FACED")
    
    bullet_item(pdf, "Managing Reactive LocalStorage Synced States:",
                "Synchronizing browser LocalStorage events with React's rendering pipeline. "
                "Resolved by implementing a custom useLocalStorage state wrapper that dispatches events "
                "across components when mutations occur.")
    
    bullet_item(pdf, "Optimizing Graph Traversals in React:",
                "Calculating critical paths and dependency loops during every render cycle could degrade performance. "
                "Resolved by wrapping these algorithms in useMemo hooks, triggering recalculations only "
                "when task dependency arrays are modified.")
    
    bullet_item(pdf, "Consolidating Dynamic Validation Messages:",
                "Managing error states between the TemplateChecker and ProjectForm. "
                "Resolved by removing duplicate layouts and centralizing validation status in the "
                "TemplateChecker component.")

    # -------------------------------------------------------------------------
    # PAGE 20: 13. FUTURE ENHANCEMENTS
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "13. FUTURE ENHANCEMENTS")
    
    bullet_item(pdf, "Enterprise Backend Service Integration:",
                "Migrate client storage to a secure backend database (e.g. Node.js with PostgreSQL). "
                "Integrate JWT authentication to replace plaintext client-side login storage.")
    
    bullet_item(pdf, "Real-time Collaboration Websockets:",
                "Implement socket layers (e.g. Socket.io) to synchronize task updates, "
                "milestone statuses, and assignments instantly across multiple team sessions.")
    
    bullet_item(pdf, "AI-Powered Optimization Engine:",
                "Integrate AI models to analyze team member skills and task histories, "
                "suggesting optimal assignments based on capacity and domain expertise.")
    
    bullet_item(pdf, "Role-Based Access Control (RBAC):",
                "Extend authorization logic to support custom roles (Admin, Project Manager, Engineer). "
                "This ensures team members can only edit tasks allocated to them.")

    # -------------------------------------------------------------------------
    # PAGE 21: 14. CONCLUSION
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "14. PROJECT CONCLUSION")
    
    body_text(
        "The 'RageJEX EpicTask Dashboard' project successfully implements an active project management tool. "
        "By leveraging client-side graph validation algorithms (for cycle detection and critical path timelines) "
        "alongside greedy load balancing logic, the system helps prevent scheduling bottlenecks before they occur.\n\n"
        "Persisting state in browser LocalStorage ensures fast response times and offline capability. "
        "The project template checker ensures project structures follow required milestones, "
        "providing a clean, professional user experience.\n\n"
        "The application meets all case study specifications and functional requirements. "
        "It serves as a solid foundation for future web application modules, demonstrating "
        "the utility of incorporating algorithms directly into frontend interface layouts."
    )

    # -------------------------------------------------------------------------
    # PAGE 22: 15. REFERENCES
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "15. REFERENCES AND BIBLIOGRAPHY")
    
    bullet_item(pdf, "React Documentation:",
                "Official React documentation. Context API, state hooks, and component rendering optimization. https://react.dev")
    
    bullet_item(pdf, "Introduction to Algorithms (Cormen et al.):",
                "Graph traversals, Depth-First Search, Directed Acyclic Graph pathways, and cycle validation. MIT Press.")
    
    bullet_item(pdf, "Vite Guide:",
                "Productive configuration pipelines, hot module replacement, and production asset bundling. https://vite.dev")
    
    bullet_item(pdf, "Tailwind CSS Styling Guidelines:",
                "Responsive grids, viewport variables, dynamic theme control, and flex utilities. https://tailwindcss.com")
    
    bullet_item(pdf, "MDN Web Storage API Specifications:",
                "Synchronous data serialization and browser client persistence. https://developer.mozilla.org")

    # -------------------------------------------------------------------------
    # PAGE 23: 16. GITHUB REPOSITORY & 17. LIVE DEMO
    # -------------------------------------------------------------------------
    pdf.add_page()
    chapter_title(pdf, "16. GITHUB REPOSITORY & LIVE DEMO")
    
    section_heading(pdf, "16.1 GitHub Repository")
    body_text(
        "The full source code, asset files, and documentation sheets are available in the public repository:\n"
        "  - Repository URL: [GITHUB LINK]"
    )
    
    section_heading(pdf, "16.2 Live Demo")
    body_text(
        "A live version of the dashboard is deployed and available at:\n"
        "  - Deployment URL: [LIVE DEMO LINK]"
    )
    
    pdf.ln(30)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 10, "End of Academic Project Report.", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # Save the output
    output_dir = "/Users/yuvrajjitendrasingh/Desktop/react_final_project/documents"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "PROJECT_DOCUMENTATION.pdf")
    pdf.output(output_path)
    print(f"Academic PDF successfully written to: {output_path}")

if __name__ == "__main__":
    main()
