import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { type CvData } from '../types';

interface CvPdfProps { cvData: CvData; }

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto/static/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Roboto/static/Roboto-Italic.ttf', fontWeight: 'normal', fontStyle: 'italic' },
    { src: '/fonts/Roboto/static/Roboto-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Roboto/static/Roboto-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 32, paddingHorizontal: 36, fontSize: 11, color: '#374151', fontFamily: 'Roboto' },
  header: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D1D5DB', paddingBottom: 12, marginBottom: 16 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#111827', fontFamily: 'Roboto' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  muted: { fontSize: 10, color: '#4B5563' },
  linkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4, fontSize: 10 },
  link: { color: '#2563EB', textDecoration: 'none' },
  dotSep: { marginHorizontal: 8 },

  section: { marginBottom: 14 },
  sectionTitleWrap: { borderBottomWidth: 2, borderBottomColor: '#BFDBFE', paddingBottom: 4, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E40AF', textTransform: 'uppercase' },

  paragraph: { fontSize: 11, color: '#374151', marginBottom: 6, lineHeight: 1.4 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  bullet: { width: 10, color: '#2563EB', marginTop: 1 },
  listText: { flex: 1, fontSize: 11, color: '#374151', lineHeight: 1.4 },

  expItem: { marginBottom: 10 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  jobTitle: { fontSize: 12, fontWeight: 'bold', color: '#1F2937' },
  dates: { fontSize: 10, color: '#4B5563' },
  company: { fontSize: 11, fontStyle: 'italic', color: '#4B5563', marginTop: 2 },

  projTitle: { fontSize: 12, fontWeight: 'bold', color: '#1E40AF', marginBottom: 2 },
});

const toHref = (url?: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
const pretty = (url?: string) => !url ? '' : url.replace(/^https?:\/\//, '');

type Block = { type: 'p' | 'li'; content: string };

function parseSummaryToBlocks(text: string): Block[] {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let currentParagraph: string[] = [];

  const listMarkers = /^[-*•◦▪▫]\s+(.+)$/;
  const numberedList = /^\d+[.)]\s+(.+)$/;

  const flush = () => {
    if (currentParagraph.length) {
      blocks.push({ type: 'p', content: currentParagraph.join(' ') });
      currentParagraph = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') { flush(); continue; }
    if (listMarkers.test(line) || numberedList.test(line)) {
      flush();
      const content = line.replace(listMarkers, '$1').replace(numberedList, '$1');
      blocks.push({ type: 'li', content });
    } else {
      currentParagraph.push(line);
    }
  }
  flush();
  return blocks;
}

const CvPdf: React.FC<CvPdfProps> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = cvData;
  const summaryBlocks = parseSummaryToBlocks(summary);

  const projHeader = (p: {title:string; context?:string; role:string}) =>
    `${p.title}${p.context ? ` (${p.context})` : ''} | ${p.role}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name} | {personalInfo.jobTitle}</Text>
          <View style={styles.rowCenter}>
            {personalInfo.address ? <Text style={styles.muted}>{personalInfo.address}</Text> : null}
            {personalInfo.address && (personalInfo.phone || personalInfo.email) ? (<Text style={[styles.muted, styles.dotSep]}>•</Text>) : null}
            {personalInfo.phone ? (<Link src={`tel:${personalInfo.phone}`} style={styles.muted}>{personalInfo.phone}</Link>) : null}
            {personalInfo.phone && personalInfo.email ? (<Text style={[styles.muted, styles.dotSep]}>•</Text>) : null}
            {personalInfo.email ? (<Link src={`mailto:${personalInfo.email}`} style={styles.muted}>{personalInfo.email}</Link>) : null}
          </View>
          {(personalInfo.linkedin || personalInfo.github) && (
            <View style={styles.linkRow}>
              {personalInfo.linkedin ? (<Link src={toHref(personalInfo.linkedin)} style={styles.link}>{pretty(personalInfo.linkedin)}</Link>) : null}
              {personalInfo.linkedin && personalInfo.github ? <Text style={styles.dotSep}>•</Text> : null}
              {personalInfo.github ? (<Link src={toHref(personalInfo.github)} style={styles.link}>{pretty(personalInfo.github)}</Link>) : null}
            </View>
          )}
        </View>

        {/* Özet */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>Professional Summary</Text></View>
          {summaryBlocks.length === 0
            ? <Text style={styles.paragraph}></Text>
            : summaryBlocks.map((b, i) =>
                b.type === 'p'
                  ? <Text key={`p-${i}`} style={styles.paragraph}>{b.content}</Text>
                  : <View key={`li-${i}`} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>{b.content}</Text></View>
              )
          }
        </View>

        {/* İş Deneyimi */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>Work Experience</Text></View>
          {experience.map(exp => (
            <View key={exp.id} style={styles.expItem} wrap={false}>
              <View style={styles.expHeader}>
                <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={styles.company}>{exp.company}</Text>
              {parseSummaryToBlocks(exp.description).map((b, i) =>
                b.type === 'p'
                  ? <Text key={`exp-p-${exp.id}-${i}`} style={styles.paragraph}>{b.content}</Text>
                  : <View key={`exp-li-${exp.id}-${i}`} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>{b.content}</Text></View>
              )}
            </View>
          ))}
        </View>

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>Projects</Text></View>
            {projects.map(p => (
              <View key={p.id} style={{ marginBottom: 8 }} wrap={false}>
                <Text style={styles.projTitle}>{projHeader(p)}</Text>
                {parseSummaryToBlocks(p.description).map((b, i) =>
                  b.type === 'p'
                    ? <Text key={`prj-p-${p.id}-${i}`} style={styles.paragraph}>{b.content}</Text>
                    : <View key={`prj-li-${p.id}-${i}`} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>{b.content}</Text></View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Eğitim */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>Education</Text></View>
          {education.map(edu => (
            <View key={edu.id} style={{ marginBottom: 8 }}>
              <View style={styles.expHeader}>
                <Text style={styles.jobTitle}>{edu.school}</Text>
                <Text style={styles.dates}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={styles.company}>{edu.degree}</Text>
            </View>
          ))}
        </View>

        {/* Yetenekler */}
        <View style={styles.section}>
          <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>Technical Skills</Text></View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {skills.map((s, i) => (
              <Text key={s.id} style={{ fontSize: 11, color: '#374151' }}>
                {s.name}{i < skills.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CvPdf;
