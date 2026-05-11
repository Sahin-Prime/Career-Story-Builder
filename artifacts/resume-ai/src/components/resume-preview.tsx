import { useResumeStore } from "@/lib/store";

export function ResumePreview() {
  const { data } = useResumeStore();
  const { contact, skills, experience, education, projects, certifications, languages } = data;

  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const hasAnyContent =
    contact.fullName ||
    contact.email ||
    contact.phone ||
    skills ||
    experience.length > 0 ||
    education.length > 0 ||
    projects.length > 0;

  return (
    <div
      className="w-full max-w-2xl mx-auto bg-white text-[#1a1a2e] shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-none"
      data-testid="resume-preview"
      id="resume-preview"
      style={{ fontFamily: "'DM Mono', monospace", minHeight: 900 }}
    >
      {!hasAnyContent ? (
        <div className="flex flex-col items-center justify-center h-96 text-center px-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-sans">
            Start filling in your details on the left<br />and your resume will appear here.
          </p>
        </div>
      ) : (
        <div className="p-10">
          {/* Name & Title */}
          <div className="mb-1">
            <h1
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "2rem",
                lineHeight: 1.1,
                color: "#3d35b5",
                letterSpacing: "-0.5px",
              }}
            >
              {contact.fullName || "Your Name"}
            </h1>
            {contact.jobTitle && (
              <p className="text-sm text-gray-500 mt-0.5 font-sans">{contact.jobTitle}</p>
            )}
          </div>

          {/* Contact row */}
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 pb-3 border-b-2"
            style={{ borderColor: "#3d35b5" }}
          >
            {contact.email && (
              <span data-testid="preview-email">{contact.email}</span>
            )}
            {contact.phone && (
              <span data-testid="preview-phone">{contact.phone}</span>
            )}
            {contact.location && (
              <span data-testid="preview-location">{contact.location}</span>
            )}
            {contact.website && (
              <span data-testid="preview-website">{contact.website}</span>
            )}
          </div>

          {/* Summary */}
          {contact.summary && (
            <ResumeSection title="Professional Summary">
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                {contact.summary}
              </p>
            </ResumeSection>
          )}

          {/* Skills */}
          {skillList.length > 0 && (
            <ResumeSection title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: "#3d35b508",
                      border: "1px solid #3d35b530",
                      color: "#3d35b5",
                    }}
                    data-testid={`skill-tag-${i}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <ResumeSection title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4 last:mb-0" data-testid={`preview-exp-${exp.id}`}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <p className="font-sans font-bold text-sm text-[#1a1a2e]">{exp.role}</p>
                      <p className="text-xs text-gray-500 italic">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {exp.startDate}
                      {(exp.startDate || exp.endDate || exp.current) &&
                        ` — ${exp.current ? "Present" : exp.endDate}`}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <ResumeSection title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 last:mb-0" data-testid={`preview-edu-${edu.id}`}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <p className="font-sans font-bold text-sm text-[#1a1a2e]">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</p>
                      <p className="text-xs text-gray-500 italic">{edu.school}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {edu.startDate}{(edu.startDate || edu.endDate) && ` — ${edu.endDate}`}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <ResumeSection title="Projects">
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3 last:mb-0" data-testid={`preview-proj-${proj.id}`}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <p className="font-sans font-bold text-sm text-[#1a1a2e]">{proj.name}</p>
                    {proj.url && (
                      <span className="text-xs text-[#3d35b5]">{proj.url}</span>
                    )}
                  </div>
                  {proj.tech && (
                    <p className="text-xs text-gray-400 italic mt-0.5">{proj.tech}</p>
                  )}
                  {proj.description && (
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <ResumeSection title="Certifications">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center mb-1.5 last:mb-0" data-testid={`preview-cert-${cert.id}`}>
                  <div>
                    <span className="font-sans font-bold text-sm text-[#1a1a2e]">{cert.name}</span>
                    {cert.issuer && <span className="text-xs text-gray-500 ml-2 italic">{cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-xs text-gray-400">{cert.date}</span>}
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <ResumeSection title="Languages">
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <div key={lang.id} data-testid={`preview-lang-${lang.id}`}>
                    <span className="text-sm font-sans font-bold text-[#1a1a2e]">{lang.language}</span>
                    {lang.proficiency && (
                      <span className="text-xs text-gray-500 ml-1">({lang.proficiency})</span>
                    )}
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}
        </div>
      )}
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2
        className="text-xs font-sans font-black tracking-widest uppercase mb-2 pb-1.5 border-b"
        style={{ color: "#3d35b5", borderColor: "#3d35b520", letterSpacing: "0.14em" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
