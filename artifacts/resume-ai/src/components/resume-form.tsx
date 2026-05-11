import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import type { Experience, Education, Project, Certification, Language } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  Plus,
  Trash2,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Rocket,
  Award,
  Globe,
  Zap,
  Loader2,
} from "lucide-react";
import { useEnhanceText, useSuggestSkills } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

function SectionCard({
  icon,
  title,
  iconClass,
  children,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  iconClass: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-border/80">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-card/80 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
        data-testid={`section-toggle-${title.toLowerCase().replace(/\s/g, "-")}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm", iconClass)}>
            {icon}
          </div>
          <span className="font-semibold text-sm tracking-wide">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-3 border-t border-border animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function FieldRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-3", className)}>{children}</div>;
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "col-span-2")}>
      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
        {label}
      </Label>
      {children}
    </div>
  );
}

type AITarget = {
  type: "summary" | "experience" | "project" | "cover";
  context: string;
  jobTitle?: string;
  existingText?: string;
  onResult: (text: string) => void;
  label: string;
};

export function ResumeForm() {
  const store = useResumeStore();
  const { data } = store;
  const [aiTarget, setAiTarget] = useState<AITarget | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");

  const enhanceMutation = useEnhanceText();
  const suggestSkillsMutation = useSuggestSkills();

  const newId = () => crypto.randomUUID();

  function openAI(target: AITarget) {
    setAiTarget(target);
    setAiPrompt(target.existingText ?? "");
  }

  function closeAI() {
    setAiTarget(null);
    setAiPrompt("");
    enhanceMutation.reset();
  }

  function runAI() {
    if (!aiTarget) return;
    enhanceMutation.mutate(
      {
        data: {
          type: aiTarget.type,
          context: aiPrompt || aiTarget.context,
          jobTitle: aiTarget.jobTitle ?? data.contact.jobTitle ?? null,
          existingText: aiTarget.existingText ?? null,
        },
      },
      {
        onSuccess: (result) => {
          aiTarget.onResult(result.text);
          closeAI();
        },
      }
    );
  }

  function runSuggestSkills() {
    const role = data.contact.jobTitle || "Software Engineer";
    suggestSkillsMutation.mutate(
      { data: { role, existingSkills: data.skills || null } },
      {
        onSuccess: (result) => {
          const incoming = result.skills.join(", ");
          const current = data.skills.trim();
          store.updateSkills(current ? `${current}, ${incoming}` : incoming);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Contact Info */}
      <SectionCard
        icon={<User className="w-4 h-4" />}
        iconClass="bg-blue-500/15 text-blue-400"
        title="Contact Info"
        defaultOpen
      >
        <FieldRow>
          <Field label="Full Name">
            <Input
              data-testid="input-full-name"
              placeholder="Jane Doe"
              value={data.contact.fullName}
              onChange={(e) => store.updateContact({ fullName: e.target.value })}
            />
          </Field>
          <Field label="Job Title">
            <Input
              data-testid="input-job-title"
              placeholder="Senior Engineer"
              value={data.contact.jobTitle}
              onChange={(e) => store.updateContact({ jobTitle: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              data-testid="input-email"
              type="email"
              placeholder="jane@example.com"
              value={data.contact.email}
              onChange={(e) => store.updateContact({ email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              data-testid="input-phone"
              placeholder="+1 555 000 0000"
              value={data.contact.phone}
              onChange={(e) => store.updateContact({ phone: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <Input
              data-testid="input-location"
              placeholder="New York, NY"
              value={data.contact.location}
              onChange={(e) => store.updateContact({ location: e.target.value })}
            />
          </Field>
          <Field label="LinkedIn / Website">
            <Input
              data-testid="input-website"
              placeholder="linkedin.com/in/jane"
              value={data.contact.website}
              onChange={(e) => store.updateContact({ website: e.target.value })}
            />
          </Field>
          <Field label="Professional Summary" full>
            <Textarea
              data-testid="input-summary"
              placeholder="A brief 2–3 sentence summary of your background and goals…"
              rows={3}
              value={data.contact.summary}
              onChange={(e) => store.updateContact({ summary: e.target.value })}
            />
          </Field>
          <div className="col-span-2">
            <Button
              size="sm"
              data-testid="button-ai-summary"
              className="bg-gradient-to-r from-[hsl(330,70%,55%)] to-[hsl(300,60%,50%)] text-white hover:opacity-90 text-xs gap-1.5 shadow-sm"
              onClick={() =>
                openAI({
                  type: "summary",
                  context: `Job title: ${data.contact.jobTitle || "professional"}. Current summary: ${data.contact.summary}`,
                  jobTitle: data.contact.jobTitle,
                  existingText: data.contact.summary,
                  label: "AI-Write My Summary",
                  onResult: (text) => store.updateContact({ summary: text }),
                })
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI-Write My Summary
            </Button>
          </div>
        </FieldRow>
      </SectionCard>

      {/* Skills */}
      <SectionCard
        icon={<Zap className="w-4 h-4" />}
        iconClass="bg-teal-500/15 text-teal-400"
        title="Skills"
      >
        <Field label="Skills (comma-separated)">
          <Textarea
            data-testid="input-skills"
            placeholder="JavaScript, React, Node.js, Python, Git…"
            rows={2}
            value={data.skills}
            onChange={(e) => store.updateSkills(e.target.value)}
          />
        </Field>
        <Button
          size="sm"
          data-testid="button-suggest-skills"
          className="self-start bg-gradient-to-r from-[hsl(330,70%,55%)] to-[hsl(300,60%,50%)] text-white hover:opacity-90 text-xs gap-1.5 shadow-sm"
          onClick={runSuggestSkills}
          disabled={suggestSkillsMutation.isPending}
        >
          {suggestSkillsMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          Suggest Skills for My Role
        </Button>
      </SectionCard>

      {/* Experience */}
      <SectionCard
        icon={<Briefcase className="w-4 h-4" />}
        iconClass="bg-violet-500/15 text-violet-400"
        title="Experience"
      >
        {data.experience.map((exp) => (
          <ExperienceItem
            key={exp.id}
            exp={exp}
            jobTitle={data.contact.jobTitle}
            onUpdate={(patch) => store.updateExperience(exp.id, patch)}
            onRemove={() => store.removeExperience(exp.id)}
            onAI={() =>
              openAI({
                type: "experience",
                context: `Role: ${exp.role} at ${exp.company}. ${exp.description}`,
                jobTitle: data.contact.jobTitle,
                existingText: exp.description,
                label: "Enhance with AI",
                onResult: (text) => store.updateExperience(exp.id, { description: text }),
              })
            }
          />
        ))}
        <button
          type="button"
          data-testid="button-add-experience"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          onClick={() =>
            store.addExperience({
              id: newId(),
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })
          }
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </SectionCard>

      {/* Education */}
      <SectionCard
        icon={<GraduationCap className="w-4 h-4" />}
        iconClass="bg-green-500/15 text-green-400"
        title="Education"
      >
        {data.education.map((edu) => (
          <EducationItem
            key={edu.id}
            edu={edu}
            onUpdate={(patch) => store.updateEducation(edu.id, patch)}
            onRemove={() => store.removeEducation(edu.id)}
          />
        ))}
        <button
          type="button"
          data-testid="button-add-education"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          onClick={() =>
            store.addEducation({
              id: newId(),
              school: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              gpa: "",
            })
          }
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </SectionCard>

      {/* Projects */}
      <SectionCard
        icon={<Rocket className="w-4 h-4" />}
        iconClass="bg-amber-500/15 text-amber-400"
        title="Projects"
      >
        {data.projects.map((proj) => (
          <ProjectItem
            key={proj.id}
            proj={proj}
            jobTitle={data.contact.jobTitle}
            onUpdate={(patch) => store.updateProject(proj.id, patch)}
            onRemove={() => store.removeProject(proj.id)}
            onAI={() =>
              openAI({
                type: "project",
                context: `Project: ${proj.name}. Tech: ${proj.tech}. ${proj.description}`,
                jobTitle: data.contact.jobTitle,
                existingText: proj.description,
                label: "Enhance with AI",
                onResult: (text) => store.updateProject(proj.id, { description: text }),
              })
            }
          />
        ))}
        <button
          type="button"
          data-testid="button-add-project"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          onClick={() =>
            store.addProject({ id: newId(), name: "", url: "", description: "", tech: "" })
          }
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </SectionCard>

      {/* Certifications */}
      <SectionCard
        icon={<Award className="w-4 h-4" />}
        iconClass="bg-pink-500/15 text-pink-400"
        title="Certifications"
      >
        {data.certifications.map((cert) => (
          <CertificationItem
            key={cert.id}
            cert={cert}
            onUpdate={(patch) => store.updateCertification(cert.id, patch)}
            onRemove={() => store.removeCertification(cert.id)}
          />
        ))}
        <button
          type="button"
          data-testid="button-add-certification"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          onClick={() =>
            store.addCertification({ id: newId(), name: "", issuer: "", date: "" })
          }
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </SectionCard>

      {/* Languages */}
      <SectionCard
        icon={<Globe className="w-4 h-4" />}
        iconClass="bg-red-500/15 text-red-400"
        title="Languages"
      >
        {data.languages.map((lang) => (
          <LanguageItem
            key={lang.id}
            lang={lang}
            onUpdate={(patch) => store.updateLanguage(lang.id, patch)}
            onRemove={() => store.removeLanguage(lang.id)}
          />
        ))}
        <button
          type="button"
          data-testid="button-add-language"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          onClick={() =>
            store.addLanguage({ id: newId(), language: "", proficiency: "" })
          }
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </SectionCard>

      {/* AI Modal */}
      <Dialog open={!!aiTarget} onOpenChange={(open) => !open && closeAI()}>
        <DialogContent className="sm:max-w-lg" data-testid="ai-modal">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              <span className="italic text-secondary">{aiTarget?.label ?? "AI Enhance"}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Describe your background and the AI will craft the perfect text for you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Textarea
              data-testid="ai-modal-input"
              placeholder="Add extra context, keywords, or specific achievements to include…"
              rows={4}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={closeAI} data-testid="button-ai-cancel">
                Cancel
              </Button>
              <Button
                size="sm"
                data-testid="button-ai-generate"
                className="bg-gradient-to-r from-[hsl(330,70%,55%)] to-[hsl(300,60%,50%)] text-white hover:opacity-90 gap-1.5"
                onClick={runAI}
                disabled={enhanceMutation.isPending}
              >
                {enhanceMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            {enhanceMutation.isError && (
              <p className="text-destructive text-xs">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RepeaterCard({ children, onRemove, testId }: { children: React.ReactNode; onRemove: () => void; testId?: string }) {
  return (
    <div className="relative bg-background/60 border border-border rounded-xl p-3 flex flex-col gap-2.5" data-testid={testId}>
      <button
        type="button"
        data-testid="button-remove-item"
        onClick={onRemove}
        className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive/70 hover:text-destructive transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}

function ExperienceItem({
  exp,
  jobTitle,
  onUpdate,
  onRemove,
  onAI,
}: {
  exp: Experience;
  jobTitle: string;
  onUpdate: (patch: Partial<Experience>) => void;
  onRemove: () => void;
  onAI: () => void;
}) {
  return (
    <RepeaterCard onRemove={onRemove} testId={`exp-item-${exp.id}`}>
      <FieldRow>
        <Field label="Company">
          <Input
            data-testid="input-company"
            placeholder="Acme Corp"
            value={exp.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
          />
        </Field>
        <Field label="Role / Title">
          <Input
            data-testid="input-role"
            placeholder="Software Engineer"
            value={exp.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
          />
        </Field>
        <Field label="Start Date">
          <Input
            data-testid="input-start-date"
            placeholder="Jan 2022"
            value={exp.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
        </Field>
        <Field label="End Date">
          <Input
            data-testid="input-end-date"
            placeholder="Dec 2023"
            value={exp.endDate}
            disabled={exp.current}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
          />
        </Field>
        <div className="col-span-2 flex items-center gap-2">
          <Checkbox
            id={`current-${exp.id}`}
            data-testid={`checkbox-current-${exp.id}`}
            checked={exp.current}
            onCheckedChange={(checked) => onUpdate({ current: !!checked })}
          />
          <label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground cursor-pointer">
            Currently working here
          </label>
        </div>
        <Field label="Description / Achievements" full>
          <Textarea
            data-testid="input-exp-description"
            placeholder="• Led a team of 5 engineers to deliver...&#10;• Reduced API response time by 40%..."
            rows={3}
            value={exp.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </Field>
        <div className="col-span-2">
          <Button
            size="sm"
            variant="outline"
            data-testid="button-ai-enhance-exp"
            className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            onClick={onAI}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enhance with AI
          </Button>
        </div>
      </FieldRow>
    </RepeaterCard>
  );
}

function EducationItem({
  edu,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  onUpdate: (patch: Partial<Education>) => void;
  onRemove: () => void;
}) {
  return (
    <RepeaterCard onRemove={onRemove} testId={`edu-item-${edu.id}`}>
      <FieldRow>
        <Field label="School / University" full>
          <Input
            data-testid="input-school"
            placeholder="MIT"
            value={edu.school}
            onChange={(e) => onUpdate({ school: e.target.value })}
          />
        </Field>
        <Field label="Degree">
          <Input
            data-testid="input-degree"
            placeholder="Bachelor of Science"
            value={edu.degree}
            onChange={(e) => onUpdate({ degree: e.target.value })}
          />
        </Field>
        <Field label="Field of Study">
          <Input
            data-testid="input-field"
            placeholder="Computer Science"
            value={edu.field}
            onChange={(e) => onUpdate({ field: e.target.value })}
          />
        </Field>
        <Field label="Start">
          <Input
            data-testid="input-edu-start"
            placeholder="Sep 2018"
            value={edu.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
        </Field>
        <Field label="End">
          <Input
            data-testid="input-edu-end"
            placeholder="Jun 2022"
            value={edu.endDate}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
          />
        </Field>
        <Field label="GPA (optional)">
          <Input
            data-testid="input-gpa"
            placeholder="3.9"
            value={edu.gpa}
            onChange={(e) => onUpdate({ gpa: e.target.value })}
          />
        </Field>
      </FieldRow>
    </RepeaterCard>
  );
}

function ProjectItem({
  proj,
  jobTitle,
  onUpdate,
  onRemove,
  onAI,
}: {
  proj: Project;
  jobTitle: string;
  onUpdate: (patch: Partial<Project>) => void;
  onRemove: () => void;
  onAI: () => void;
}) {
  return (
    <RepeaterCard onRemove={onRemove} testId={`proj-item-${proj.id}`}>
      <FieldRow>
        <Field label="Project Name">
          <Input
            data-testid="input-project-name"
            placeholder="My Awesome App"
            value={proj.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </Field>
        <Field label="URL (optional)">
          <Input
            data-testid="input-project-url"
            placeholder="github.com/jane/app"
            value={proj.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
          />
        </Field>
        <Field label="Technologies" full>
          <Input
            data-testid="input-project-tech"
            placeholder="React, Node.js, PostgreSQL"
            value={proj.tech}
            onChange={(e) => onUpdate({ tech: e.target.value })}
          />
        </Field>
        <Field label="Description" full>
          <Textarea
            data-testid="input-project-description"
            placeholder="Briefly describe what the project does and its impact…"
            rows={2}
            value={proj.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </Field>
        <div className="col-span-2">
          <Button
            size="sm"
            variant="outline"
            data-testid="button-ai-enhance-proj"
            className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            onClick={onAI}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enhance with AI
          </Button>
        </div>
      </FieldRow>
    </RepeaterCard>
  );
}

function CertificationItem({
  cert,
  onUpdate,
  onRemove,
}: {
  cert: Certification;
  onUpdate: (patch: Partial<Certification>) => void;
  onRemove: () => void;
}) {
  return (
    <RepeaterCard onRemove={onRemove} testId={`cert-item-${cert.id}`}>
      <FieldRow>
        <Field label="Certification Name" full>
          <Input
            data-testid="input-cert-name"
            placeholder="AWS Certified Solutions Architect"
            value={cert.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </Field>
        <Field label="Issuing Organization">
          <Input
            data-testid="input-cert-issuer"
            placeholder="Amazon Web Services"
            value={cert.issuer}
            onChange={(e) => onUpdate({ issuer: e.target.value })}
          />
        </Field>
        <Field label="Date">
          <Input
            data-testid="input-cert-date"
            placeholder="Mar 2023"
            value={cert.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
          />
        </Field>
      </FieldRow>
    </RepeaterCard>
  );
}

function LanguageItem({
  lang,
  onUpdate,
  onRemove,
}: {
  lang: Language;
  onUpdate: (patch: Partial<Language>) => void;
  onRemove: () => void;
}) {
  return (
    <RepeaterCard onRemove={onRemove} testId={`lang-item-${lang.id}`}>
      <FieldRow>
        <Field label="Language">
          <Input
            data-testid="input-language"
            placeholder="Spanish"
            value={lang.language}
            onChange={(e) => onUpdate({ language: e.target.value })}
          />
        </Field>
        <Field label="Proficiency">
          <Input
            data-testid="input-proficiency"
            placeholder="Fluent / Native / B2"
            value={lang.proficiency}
            onChange={(e) => onUpdate({ proficiency: e.target.value })}
          />
        </Field>
      </FieldRow>
    </RepeaterCard>
  );
}
