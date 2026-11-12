"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { GlassButton } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { CONTENT } from "@/lib/content";
import { useHydrated } from "@/lib/hooks";
import type { Lang } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";

type Field = HTMLInputElement | HTMLTextAreaElement;

/** Prepares a mailto: draft in the visitor's own email app. Nothing is sent from the site. */
export function ContactForm({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].contact.form;
  const hydrated = useHydrated();
  const draftLink = useRef<HTMLAnchorElement>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const onInput = (event: FormEvent<HTMLFormElement>) => {
    (event.target as Field).setCustomValidity("");
    setDraft(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = [...form.querySelectorAll<Field>("input, textarea")];
    fields.forEach((field) =>
      field.setCustomValidity(field.value.trim() ? "" : t.blank),
    );
    if (!form.reportValidity()) return;
    const [name, email, message] = fields.map((field) => field.value.trim());
    const subject = encodeURIComponent(t.subject(name));
    const body = encodeURIComponent(
      `${t.greeting}\n\n${message}\n\n${t.signOff}\n${name}\n${email}`,
    );
    // The link has to be in the page before it can be followed.
    flushSync(() => setDraft(`mailto:${EMAIL}?subject=${subject}&body=${body}`));
    draftLink.current?.click();
  };

  return (
    <form
      id="contactForm"
      className="contact-form reveal"
      onInput={onInput}
      onSubmit={onSubmit}
    >
      <h3>
        {t.title.lead}
        <span className="tuck">{t.title.tuck}</span>
      </h3>
      <div className="form-row">
        <div className="field">
          <input
            id="fieldName"
            name="name"
            autoComplete="name"
            placeholder=" "
            required
            maxLength={100}
          />
          <label htmlFor="fieldName">{t.name}</label>
        </div>
        <div className="field">
          <input
            id="fieldEmail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder=" "
            required
            maxLength={254}
          />
          <label htmlFor="fieldEmail">{t.email}</label>
        </div>
      </div>
      <div className="field">
        <textarea
          id="fieldMessage"
          name="message"
          placeholder=" "
          rows={4}
          required
          maxLength={3000}
        />
        <label htmlFor="fieldMessage">{t.message}</label>
      </div>
      <GlassButton
        type="submit"
        variant="filled"
        size="lg"
        className="button button-solid"
        id="contactSubmit"
        disabled={!hydrated}
      >
        {t.submit} <Arrow glyph="↗" />
      </GlassButton>
      <p className="form-hint" id="formHint">
        {t.hint}
      </p>
      <p id="formStatus" role="status" aria-live="polite">
        {draft && (
          <>
            {t.ready}{" "}
            <a ref={draftLink} href={draft}>
              {t.reopen}
            </a>
          </>
        )}
      </p>
      <noscript>
        <p>{t.noScript}</p>
      </noscript>
    </form>
  );
}
