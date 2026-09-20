"use client";

import type { StepProps } from "../wizard-types";

const genders = ["Man", "Woman", "Non-binary", "Prefer not to say"];
const seeking = ["Men", "Women", "Open to both"];

function age(dob: string): number | null {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[52px] px-4 py-2 rounded-md border text-[15px] font-sans transition-colors text-left ${
        selected
          ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
          : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
      }`}
    >
      {label}
    </button>
  );
}

export function Step3About({ data, update }: StepProps) {
  const calculatedAge = age(data.dateOfBirth);

  const toggleSeeking = (value: string) => {
    const current = data.seekingGender;
    if (current.includes(value)) {
      update({ seekingGender: current.filter((g) => g !== value) });
    } else {
      update({ seekingGender: [...current, value] });
    }
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 3 of 10
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        About you
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-10">
        These details help us identify people at a compatible life stage.
      </p>

      <div className="space-y-9">
        {/* Date of birth */}
        <div>
          <label htmlFor="dob" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Date of birth
          </label>
          <div className="flex items-center gap-4">
            <input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => update({ dateOfBirth: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              min="1935-01-01"
              className="flex-1 min-h-[52px] px-4 bg-ivory border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood"
            />
            {calculatedAge !== null && (
              <span className="text-[15px] text-plum-muted font-sans whitespace-nowrap">
                Age {calculatedAge}
              </span>
            )}
          </div>
          <p className="mt-2 text-[12px] text-stone">
            Used to calculate your age for matching. Not displayed publicly.
          </p>
        </div>

        {/* Gender */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            I am a…
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {genders.map((g) => (
              <OptionButton
                key={g}
                label={g}
                selected={data.gender === g}
                onClick={() => update({ gender: g })}
              />
            ))}
          </div>
        </fieldset>

        {/* Who they're hoping to meet */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            I&rsquo;m hoping to meet… (select all that apply)
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {seeking.map((s) => (
              <OptionButton
                key={s}
                label={s}
                selected={data.seekingGender.includes(s)}
                onClick={() => toggleSeeking(s)}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
