const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

class CVProcessingService {
  constructor() {
    this.supportedFormats = ['.pdf', '.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
  }

  /**
   * Extract text from CV file
   */
  async extractTextFromCV(filePath) {
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      
      if (!this.supportedFormats.includes(fileExtension)) {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('CV file not found');
      }

      let extractedText = '';

      if (fileExtension === '.pdf') {
        // For PDF files, we'll need to convert to image first or use pdf-parse
        // For now, let's handle image formats with Tesseract
        throw new Error('PDF processing not implemented yet. Please use image formats.');
      } else {
        // Process image files with Tesseract
        const result = await Tesseract.recognize(filePath, 'eng', {
          logger: m => console.log(m) // Optional: log progress
        });
        extractedText = result.data.text;
      }

      return this.cleanAndStructureText(extractedText);
    } catch (error) {
      console.error('Error extracting text from CV:', error.message);
      throw new Error('Failed to process CV file');
    }
  }

  /**
   * Clean and structure extracted text
   */
  cleanAndStructureText(rawText) {
    // Remove extra whitespace and clean up text
    let cleanText = rawText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .trim();

    // Extract key sections if possible
    const structuredCV = this.extractCVSections(cleanText);
    
    return {
      rawText: cleanText,
      structured: structuredCV,
      summary: this.generateCVSummary(structuredCV)
    };
  }

  /**
   * Extract structured sections from CV text
   */
  extractCVSections(text) {
    const sections = {
      personalInfo: '',
      experience: '',
      education: '',
      skills: '',
      other: ''
    };

    // Simple keyword-based section detection
    const experienceKeywords = ['experience', 'work history', 'employment', 'career'];
    const educationKeywords = ['education', 'academic', 'degree', 'university', 'college'];
    const skillsKeywords = ['skills', 'technical skills', 'competencies', 'technologies'];

    const lines = text.split('\n');
    let currentSection = 'other';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      // Detect section headers
      if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
        currentSection = 'experience';
      } else if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
        currentSection = 'education';
      } else if (skillsKeywords.some(keyword => lowerLine.includes(keyword))) {
        currentSection = 'skills';
      }
      
      // Add line to current section
      if (line.trim()) {
        sections[currentSection] += line + '\n';
      }
    });

    // Extract personal info (email, phone) from the beginning
    const firstPart = lines.slice(0, 10).join('\n');
    const emailMatch = firstPart.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = firstPart.match(/[\+]?[\d\s\-\(\)]{10,}/);
    
    sections.personalInfo = `${emailMatch ? 'Email: ' + emailMatch[0] : ''}\n${phoneMatch ? 'Phone: ' + phoneMatch[0] : ''}`;

    return sections;
  }

  /**
   * Generate a concise summary for AI agent context
   */
  generateCVSummary(structuredCV) {
    let summary = '';

    if (structuredCV.personalInfo.trim()) {
      summary += `Contact: ${structuredCV.personalInfo.trim()}\n\n`;
    }

    if (structuredCV.experience.trim()) {
      // Extract first few lines of experience
      const expLines = structuredCV.experience.split('\n').slice(0, 5);
      summary += `Experience: ${expLines.join(' ').substring(0, 200)}...\n\n`;
    }

    if (structuredCV.education.trim()) {
      const eduLines = structuredCV.education.split('\n').slice(0, 3);
      summary += `Education: ${eduLines.join(' ').substring(0, 150)}...\n\n`;
    }

    if (structuredCV.skills.trim()) {
      const skillsLines = structuredCV.skills.split('\n').slice(0, 3);
      summary += `Skills: ${skillsLines.join(' ').substring(0, 150)}...`;
    }

    return summary.trim();
  }

  /**
   * Extract key skills and technologies from CV
   */
  extractSkills(cvText) {
    const commonSkills = [
      // Programming Languages
      'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin',
      'typescript', 'scala', 'rust', 'r', 'matlab',
      
      // Web Technologies
      'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'bootstrap', 'tailwind', 'sass', 'less',
      
      // Databases
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
      
      // Cloud & DevOps
      'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
      'gitlab', 'ci/cd', 'terraform',
      
      // Frameworks & Libraries
      'spring', 'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap',
      
      // Other
      'machine learning', 'artificial intelligence', 'data science', 'blockchain',
      'mobile development', 'ios', 'android', 'react native', 'flutter'
    ];

    const lowerText = cvText.toLowerCase();
    const foundSkills = commonSkills.filter(skill => 
      lowerText.includes(skill.toLowerCase())
    );

    return foundSkills;
  }

  /**
   * Estimate years of experience from CV
   */
  estimateExperience(cvText) {
    const yearMatches = cvText.match(/\b(20\d{2}|19\d{2})\b/g);
    if (!yearMatches || yearMatches.length < 2) return 0;

    const years = yearMatches.map(y => parseInt(y)).filter(y => y >= 1990 && y <= new Date().getFullYear());
    if (years.length < 2) return 0;

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    return Math.max(0, maxYear - minYear);
  }
}

module.exports = new CVProcessingService();
