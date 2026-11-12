"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { GlassButton } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { useHydrated } from "@/lib/hooks";
import { EMAIL } from "@/lib/site";

type Field = HTMLInputElement | HTMLTextAreaElement;

/** Prepares a mailto: draft in the visitor's own email app. Nothing is sent from the site. */
export function ContactForm() {
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
      field.setCustomValidity(
        field.value.trim() ? "" : "Mohon isi kolom ini, bukan hanya spasi.",
      ),
    );
    if (!form.reportValidity()) return;
    const [name, email, message] = fields.map((field) => field.value.trim());
    const subject = encodeURIComponent(`Pesan dari ${name} — Website Portofolio`);
    const body = encodeURIComponent(
      `Halo Rayhandi,\n\n${message}\n\nSalam,\n${name}\n${email}`,
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
        Mari mulai sesuatu<span className="tuck">.</span>
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
          <label htmlFor="fieldName">Nama</label>
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
          <label htmlFor="fieldEmail">Email</label>
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
        <label htmlFor="fieldMessage">Ceritakan idemu</label>
      </div>
      <GlassButton
        type="submit"
        variant="filled"
        size="lg"
        className="button button-solid"
        id="contactSubmit"
        disabled={!hydrated}
      >
        Buka aplikasi email <Arrow glyph="↗" />
      </GlassButton>
      <p className="form-hint" id="formHint">
        Form ini menyiapkan draft di aplikasi email, bukan mengirim pesan
        langsung.
      </p>
      <p id="formStatus" role="status" aria-live="polite">
        {draft && (
          <>
            Draft siap dibuka; pesan belum terkirim. Kirim melalui aplikasi
            email kamu. Jika tidak terbuka, atur aplikasi email default atau
            gunakan alamat email di samping.{" "}
            <a ref={draftLink} href={draft}>
              Buka ulang draft email
            </a>
          </>
        )}
      </p>
      <noscript>
        <p>
          Aktifkan JavaScript untuk menggunakan form, atau hubungi melalui
          tautan email.
        </p>
      </noscript>
    </form>
  );
}
