import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { type CvData } from '../types';

interface CvPdfProps {
  cvData: CvData;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
    fontSize: 11,
    color: '#374151',
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  muted: {
    fontSize: 10,
    color: '#4B5563',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    color: '#2563EB',
    fontSize: 10,
  },
  dotSep: {
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitleWrap: {
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
    paddingBottom: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  paragraph: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    color: '#2563EB',
    marginTop: 1,
  },
  listText: {
    flex: 1,
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.4,
  },
  expItem: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dates: {
    fontSize: 10,
    fontWeight: 'normal',
    color: '#4B5563',
  },
  company: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: '#4B5563',
    marginTop: 2,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillText: {
    fontSize: 11,
    color: '#374151',
  },
});

type Block = { type: 'p' | 'li'; content: string };

function parseSummaryToBlocks(text: string): Block[] {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let currentParagraph: string[] = [];

  const listMarkers = /^[-*•◦▪▫]\s+(.+)$/;
  const numberedList = /^\d+[.)]\s+(.+)$/;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'p', content: currentParagraph.join(' ') });
      currentParagraph = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') {
      flushParagraph();
      continue;
    }

    if (listMarkers.test(line) || numberedList.test(line)) {
      flushParagraph();
      const content = line.replace(listMarkers, '$1').replace(numberedList, '$1');
      blocks.push({ type: 'li', content });
    } else {
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  return blocks;
}

const CvPdf: React.FC<CvPdfProps> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills } = cvData;
  const summaryBlocks = parseSummaryToBlocks(summary);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <View style={styles.rowCenter}>
            {personalInfo.address ? <Text style={styles.muted}>{personalInfo.address}</Text> : null}
            {personalInfo.address && (personalInfo.phone || personalInfo.email) ? (
              <Text style={[styles.muted, styles.dotSep]}>•</Text>
            ) : null}
            {personalInfo.phone ? <Text style={styles.muted}>{personalInfo.phone}</Text> : null}
            {personalInfo.phone && personalInfo.email ? (
              <Text style={[styles.muted, styles.dotSep]}>•</Text>
            ) : null}
            {personalInfo.email ? <Text style={styles.muted}>{personalInfo.email}</Text> : null}
          </View>
          {(personalInfo.linkedin || personalInfo.github) && (
            <View style={styles.linkRow}>
              {personalInfo.linkedin ? <Text>{personalInfo.linkedin}</Text> : null}
              {personalInfo.linkedin && personalInfo.github ? <Text style={styles.dotSep}>•</Text> : null}
              {personalInfo.github ? <Text>{personalInfo.github}</Text> : null}
            </View>
          )}
        </View>

        {/* Özet */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>ÖZET</Text>
          </View>
          {summaryBlocks.length === 0 ? (
            <Text style={styles.paragraph}></Text>
          ) : (
            summaryBlocks.map((b, i) =>
              b.type === 'p' ? (
                <Text key={`p-${i}`} style={styles.paragraph}>
                  {b.content}
                </Text>
              ) : (
                <View key={`li-${i}`} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{b.content}</Text>
                </View>
              )
            )
          )}
        </View>

        {/* İş Deneyimi */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
          </View>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.expItem} wrap={false}>
              <View style={styles.expHeader}>
                <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={styles.dates}>
                  {exp.startDate} - {exp.endDate}
                </Text>
              </View>
              <Text style={styles.company}>{exp.company}</Text>
              {parseSummaryToBlocks(exp.description).map((b, i) =>
                b.type === 'p' ? (
                  <Text key={`exp-p-${exp.id}-${i}`} style={styles.paragraph}>
                    {b.content}
                  </Text>
                ) : (
                  <View key={`exp-li-${exp.id}-${i}`} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{b.content}</Text>
                  </View>
                )
              )}
            </View>
          ))}
        </View>

        {/* Eğitim */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>EĞİTİM</Text>
          </View>
          {education.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 8 }}>
              <View style={styles.expHeader}>
                <Text style={styles.jobTitle}>{edu.school}</Text>
                <Text style={styles.dates}>
                  {edu.startDate} - {edu.endDate}
                </Text>
              </View>
              <Text style={styles.company}>{edu.degree}</Text>
            </View>
          ))}
        </View>

        {/* Yetenekler */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>YETENEKLER</Text>
          </View>
          <View style={styles.skillsWrap}>
            {skills.map((skill, idx) => (
              <Text key={skill.id} style={styles.skillText}>
                {skill.name}
                {idx < skills.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CvPdf;