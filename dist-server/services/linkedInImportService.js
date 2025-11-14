import Papa from 'papaparse';
import JSZip from 'jszip';
/**
 * Parse CSV content from LinkedIn export
 */
export async function parseLinkedInCSV(csvContent, filename) {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const data = results.data;
                    const cvData = {};
                    // Determine CSV type by filename or content
                    const lowerFilename = filename.toLowerCase();
                    if (lowerFilename.includes('profile')) {
                        cvData.personalInfo = parseProfileCSV(data);
                    }
                    else if (lowerFilename.includes('position') || lowerFilename.includes('experience')) {
                        cvData.experience = parsePositionsCSV(data);
                    }
                    else if (lowerFilename.includes('education')) {
                        cvData.education = parseEducationCSV(data);
                    }
                    else if (lowerFilename.includes('skill')) {
                        cvData.skills = parseSkillsCSV(data);
                    }
                    else {
                        // Try to auto-detect based on headers
                        const headers = results.meta.fields || [];
                        if (headers.includes('Company Name') || headers.includes('Title')) {
                            cvData.experience = parsePositionsCSV(data);
                        }
                        else if (headers.includes('School Name') || headers.includes('Degree Name')) {
                            cvData.education = parseEducationCSV(data);
                        }
                        else if (headers.includes('Skill')) {
                            cvData.skills = parseSkillsCSV(data);
                        }
                        else if (headers.includes('First Name') || headers.includes('Email Address')) {
                            cvData.personalInfo = parseProfileCSV(data);
                        }
                    }
                    resolve(cvData);
                }
                catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(new Error(`CSV parsing failed: ${error.message}`));
            },
        });
    });
}
function parseProfileCSV(data) {
    const profile = data[0] || {};
    const firstName = profile['First Name'] || '';
    const lastName = profile['Last Name'] || '';
    const name = `${firstName} ${lastName}`.trim();
    return {
        name,
        jobTitle: profile['Headline'] || '',
        email: profile['Email Address'] || '',
        phone: profile['Phone Numbers'] || '',
        linkedin: '',
        github: '',
        address: profile['Address'] || '',
    };
}
function parsePositionsCSV(data) {
    return data.map((position, idx) => ({
        id: `experience-${idx + 1}`,
        jobTitle: position['Title'] || '',
        company: position['Company Name'] || '',
        startDate: formatLinkedInDate(position['Started On']),
        endDate: formatLinkedInDate(position['Finished On']) || 'Present',
        description: position['Description'] || '',
    }));
}
function parseEducationCSV(data) {
    return data.map((edu, idx) => ({
        id: `education-${idx + 1}`,
        school: edu['School Name'] || '',
        degree: edu['Degree Name'] || '',
        startDate: formatLinkedInDate(edu['Start Date']),
        endDate: formatLinkedInDate(edu['End Date']),
    }));
}
function parseSkillsCSV(data) {
    return data
        .map((item, idx) => ({
        id: `skill-${idx + 1}`,
        name: item['Skill'] || item['Name'] || '',
    }))
        .filter((skill) => skill.name);
}
/**
 * Format LinkedIn date strings (e.g., "2020" or "Jan 2020" or "2020-01")
 */
function formatLinkedInDate(dateStr) {
    if (!dateStr)
        return '';
    // Handle various formats
    const parts = dateStr.trim().split(/[\s-/]/);
    if (parts.length === 1) {
        // Just year: "2020"
        return parts[0];
    }
    else if (parts.length === 2) {
        // Month and year: "Jan 2020" or "2020-01"
        const [first, second] = parts;
        if (!isNaN(Number(first)) && first.length === 4) {
            // Format: "2020-01"
            return `${second}/${first}`;
        }
        else {
            // Format: "Jan 2020"
            return `${first} ${second}`;
        }
    }
    return dateStr;
}
/**
 * Format date from LinkedIn JSON format
 */
function formatJSONDate(dateObj) {
    if (!dateObj || !dateObj.year)
        return '';
    if (dateObj.month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthStr = months[dateObj.month - 1] || dateObj.month.toString().padStart(2, '0');
        return `${monthStr} ${dateObj.year}`;
    }
    return dateObj.year.toString();
}
/**
 * Parse LinkedIn ZIP export (from "Download your data")
 */
export async function parseLinkedInZIP(zipFile) {
    const zip = await JSZip.loadAsync(zipFile);
    const cvData = {
        experience: [],
        education: [],
        skills: [],
        projects: [],
    };
    // LinkedIn data archive structure:
    // - Profile.csv or Profile.json
    // - Positions.csv or Positions.json
    // - Education.csv or Education.json
    // - Skills.csv or Skills.json
    try {
        // Try to find and parse Profile
        const profileFile = zip.file(/profile\.(csv|json)/i)[0];
        if (profileFile) {
            const content = await profileFile.async('text');
            if (profileFile.name.endsWith('.json')) {
                const profile = JSON.parse(content);
                cvData.personalInfo = parseProfileJSON(profile);
            }
            else {
                const parsed = await parseLinkedInCSV(content, profileFile.name);
                cvData.personalInfo = parsed.personalInfo;
            }
        }
        // Try to find and parse Positions
        const positionsFile = zip.file(/position.*\.(csv|json)/i)[0];
        if (positionsFile) {
            const content = await positionsFile.async('text');
            if (positionsFile.name.endsWith('.json')) {
                const positions = JSON.parse(content);
                cvData.experience = parsePositionsJSON(positions);
            }
            else {
                const parsed = await parseLinkedInCSV(content, positionsFile.name);
                cvData.experience = parsed.experience;
            }
        }
        // Try to find and parse Education
        const educationFile = zip.file(/education\.(csv|json)/i)[0];
        if (educationFile) {
            const content = await educationFile.async('text');
            if (educationFile.name.endsWith('.json')) {
                const education = JSON.parse(content);
                cvData.education = parseEducationJSON(education);
            }
            else {
                const parsed = await parseLinkedInCSV(content, educationFile.name);
                cvData.education = parsed.education;
            }
        }
        // Try to find and parse Skills
        const skillsFile = zip.file(/skill.*\.(csv|json)/i)[0];
        if (skillsFile) {
            const content = await skillsFile.async('text');
            if (skillsFile.name.endsWith('.json')) {
                const skills = JSON.parse(content);
                cvData.skills = parseSkillsJSON(skills);
            }
            else {
                const parsed = await parseLinkedInCSV(content, skillsFile.name);
                cvData.skills = parsed.skills;
            }
        }
        return cvData;
    }
    catch (error) {
        throw new Error(`Failed to parse LinkedIn ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function parseProfileJSON(profile) {
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    const name = `${firstName} ${lastName}`.trim();
    // Extract phone number if available
    const phone = profile.phoneNumbers?.[0]?.number || '';
    // Extract LinkedIn URL from websites
    const linkedinUrl = profile.websites?.find((site) => site.url.toLowerCase().includes('linkedin.com'))?.url || '';
    return {
        name,
        jobTitle: profile.headline || '',
        email: profile.emailAddress || '',
        phone,
        linkedin: linkedinUrl,
        github: '',
        address: profile.address || '',
    };
}
function parsePositionsJSON(positions) {
    return positions.map((position, idx) => {
        // Handle both old format (startedOn.year) and new format (timePeriod)
        let startDate = '';
        let endDate = '';
        if (position.timePeriod) {
            startDate = formatJSONDate(position.timePeriod.startDate);
            endDate = position.timePeriod.endDate ? formatJSONDate(position.timePeriod.endDate) : 'Present';
        }
        else {
            // Old format
            const startYear = position['startedOn.year'];
            const startMonth = position['startedOn.month'];
            if (startYear) {
                startDate = formatJSONDate({ year: startYear, month: startMonth });
            }
            const endYear = position['finishedOn.year'];
            const endMonth = position['finishedOn.month'];
            if (endYear) {
                endDate = formatJSONDate({ year: endYear, month: endMonth });
            }
            else {
                endDate = 'Present';
            }
        }
        return {
            id: `experience-${idx + 1}`,
            jobTitle: position.title || '',
            company: position.companyName || '',
            startDate,
            endDate,
            description: position.description || '',
        };
    });
}
function parseEducationJSON(education) {
    return education.map((edu, idx) => {
        const startDate = formatJSONDate(edu.timePeriod?.startDate || edu.startDate);
        const endDate = formatJSONDate(edu.timePeriod?.endDate || edu.endDate);
        return {
            id: `education-${idx + 1}`,
            school: edu.schoolName || edu['School Name'] || '',
            degree: edu.degreeName || edu['Degree Name'] || '',
            startDate,
            endDate,
        };
    });
}
function parseSkillsJSON(skills) {
    return skills
        .map((skill, idx) => ({
        id: `skill-${idx + 1}`,
        name: skill.name || skill['Skill'] || '',
    }))
        .filter((skill) => skill.name);
}
/**
 * Parse LinkedIn PDF export
 * Note: This extracts text from PDF, which will then be sent to Gemini for parsing
 */
export async function extractTextFromPDF(pdfFile) {
    // For browser environment, we'll read the PDF as text
    // In a production environment, you'd use pdf-parse on the backend
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    // Convert to string (basic extraction)
    // Note: This is a simple implementation. For production, use a proper PDF parser on the backend
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
        const char = String.fromCharCode(uint8Array[i]);
        if (char.match(/[\x20-\x7E\n\r\t]/)) {
            text += char;
        }
    }
    return text;
}
/**
 * Merge multiple partial CV data objects
 */
export function mergeCvData(base, ...updates) {
    const result = { ...base };
    for (const update of updates) {
        if (update.personalInfo) {
            result.personalInfo = {
                ...result.personalInfo,
                ...update.personalInfo,
            };
        }
        if (update.summary) {
            result.summary = update.summary;
        }
        if (update.experience && update.experience.length > 0) {
            result.experience = [
                ...(result.experience || []),
                ...update.experience,
            ];
        }
        if (update.education && update.education.length > 0) {
            result.education = [
                ...(result.education || []),
                ...update.education,
            ];
        }
        if (update.skills && update.skills.length > 0) {
            result.skills = [
                ...(result.skills || []),
                ...update.skills,
            ];
        }
        if (update.projects && update.projects.length > 0) {
            result.projects = [
                ...(result.projects || []),
                ...update.projects,
            ];
        }
    }
    return result;
}
