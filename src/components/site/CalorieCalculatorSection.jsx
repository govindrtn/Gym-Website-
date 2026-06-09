import { useMemo, useState } from "react";
import { Activity, Calculator, Dumbbell, Flame, Scale, Target, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { CountingNumber } from "@/components/ui/counting-number";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ThemedSelect } from "@/components/ui/themed-select";
import "./CalorieCalculatorSection.css";

const ACTIVITY_LEVELS = [
  { label: "BMR only", value: 1, detail: "Resting calories only" },
  { label: "Sedentary", value: 1.2, detail: "Little or no exercise" },
  { label: "Light", value: 1.375, detail: "Exercise 1-3 days/week" },
  { label: "Moderate", value: 1.465, detail: "Exercise 4-5 days/week" },
  { label: "Active", value: 1.55, detail: "Daily weight training or hard sessions" },
  { label: "Very active", value: 1.725, detail: "Intense training 6-7 days/week" },
  { label: "Extra active", value: 1.9, detail: "Very intense training or physical job" },
];

const GOALS = [
  { label: "Maintain", value: 0, tag: "Stable" },
  { label: "Mild fat loss", value: -250, tag: "-250 kcal" },
  { label: "Fat loss", value: -500, tag: "-500 kcal" },
  { label: "Aggressive cut", value: -750, tag: "-750 kcal" },
  { label: "Lean gain", value: 300, tag: "+300 kcal" },
  { label: "Bulk", value: 500, tag: "+500 kcal" },
];

const initialForm = {
  gender: "male",
  age: "25",
  height: "170",
  weight: "70",
  activity: "1.465",
  goal: "-250",
};

function CalorieCalculatorSection() {
  const [form, setForm] = useState(initialForm);

  const result = useMemo(() => calculateCalories(form), [form]);
  const selectedActivity = ACTIVITY_LEVELS.find((activity) => String(activity.value) === form.activity);
  const selectedGoal = GOALS.find((goal) => String(goal.value) === form.goal);
  const dietPlan = getDietSuggestions(form.gender, Number(form.goal), result.targetCalories);

  function updateForm(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  return (
    <section className="section-block calorie-section">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="calorie-copy">
            <Badge variant="success" appearance="light">
              Calories calculator
            </Badge>
            <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Calculate daily calories for weight training goals.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Male/female profile, height, weight, activity aur goal ke basis par BMR, maintenance calories,
              target calories, macros aur diet suggestions milenge.
            </p>

            <div className="calorie-info-grid">
              <InfoTile icon={Calculator} label="Formula" value="Mifflin-St Jeor" />
              <InfoTile icon={Dumbbell} label="Gym focus" value="Weight training" />
              <InfoTile icon={Utensils} label="Output" value="Calories + macros" />
            </div>
          </div>

          <Card className="calorie-form-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Age 15-80 recommended. Values are estimates, not medical advice.</CardDescription>
              </CardHeading>
              <Badge variant="primary" appearance="light">
                {form.gender}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="calorie-form">
                <div className="calorie-segment" role="group" aria-label="Select gender">
                  <Button
                    type="button"
                    variant={form.gender === "male" ? "primary" : "outline"}
                    onClick={() => updateForm("gender", "male")}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={form.gender === "female" ? "primary" : "outline"}
                    onClick={() => updateForm("gender", "female")}
                  >
                    Female
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <NumberField label="Age" value={form.age} min="15" max="80" suffix="years" onChange={(value) => updateForm("age", value)} />
                  <NumberField label="Height" value={form.height} min="100" max="230" suffix="cm" onChange={(value) => updateForm("height", value)} />
                  <NumberField label="Weight" value={form.weight} min="30" max="220" suffix="kg" onChange={(value) => updateForm("weight", value)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ThemedSelect
                    id="calorie-activity"
                    label="Activity level"
                    value={form.activity}
                    options={ACTIVITY_LEVELS}
                    onChange={(value) => updateForm("activity", value)}
                    getDescription={(activity) => activity.detail}
                  />
                  <ThemedSelect
                    id="calorie-goal"
                    label="Goal"
                    value={form.goal}
                    options={GOALS}
                    onChange={(value) => updateForm("goal", value)}
                    getDescription={(goal) => goal.tag}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <ResultCard icon={Flame} label="BMR" value={result.bmr} description="Calories your body uses at rest." />
          <ResultCard icon={Activity} label="Maintenance" value={result.maintenanceCalories} description={selectedActivity?.detail ?? "Activity adjusted calories."} />
          <ResultCard icon={Target} label="Target Calories" value={result.targetCalories} description={selectedGoal?.label ?? "Selected goal calories."} featured />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="calorie-result-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Macro Split</CardTitle>
                <CardDescription>Gym-friendly split based on your target calories.</CardDescription>
              </CardHeading>
              <Scale className="size-5 text-primary" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <MacroRow label="Protein" value={result.macros.proteinGrams} calories={result.macros.proteinCalories} percent={result.macros.proteinPercent} />
              <MacroRow label="Carbs" value={result.macros.carbsGrams} calories={result.macros.carbsCalories} percent={result.macros.carbsPercent} />
              <MacroRow label="Fat" value={result.macros.fatGrams} calories={result.macros.fatCalories} percent={result.macros.fatPercent} />
              <div className={result.isBelowMinimum ? "calorie-warning" : "calorie-note"}>
                {result.isBelowMinimum
                  ? "Target calories minimum safe guideline se low hain. Dietician/doctor guidance ke bina itna low mat jao."
                  : `Estimated weekly weight change: ${result.weeklyChangeLabel}.`}
              </div>
            </CardContent>
          </Card>

          <Card className="calorie-result-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Diet Suggestions</CardTitle>
                <CardDescription>{dietPlan.title}</CardDescription>
              </CardHeading>
              <Badge variant={Number(form.goal) < 0 ? "warning" : "success"} appearance="light">
                {selectedGoal?.label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="diet-grid">
                {dietPlan.items.map((item) => (
                  <div className="diet-card" key={item.title}>
                    <div className="diet-card-title">{item.title}</div>
                    <div className="diet-card-detail">{item.detail}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function calculateCalories(form) {
  const gender = form.gender;
  const age = clampNumber(Number(form.age), 15, 80);
  const height = clampNumber(Number(form.height), 100, 230);
  const weight = clampNumber(Number(form.weight), 30, 220);
  const activity = Number(form.activity);
  const goalAdjustment = Number(form.goal);
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const maintenanceCalories = Math.round(bmr * activity);
  const targetCalories = Math.round(maintenanceCalories + goalAdjustment);
  const minimumCalories = gender === "male" ? 1500 : 1200;
  const proteinGrams = Math.round(weight * 1.8);
  const proteinCalories = proteinGrams * 4;
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);
  const carbsCalories = Math.max(targetCalories - proteinCalories - fatCalories, 0);
  const carbsGrams = Math.round(carbsCalories / 4);
  const weeklyKgChange = Math.abs((goalAdjustment * 7) / 7700);

  return {
    bmr: Math.round(bmr),
    maintenanceCalories,
    targetCalories,
    isBelowMinimum: targetCalories < minimumCalories,
    weeklyChangeLabel: goalAdjustment === 0
      ? "mostly stable"
      : `${goalAdjustment > 0 ? "+" : "-"}${weeklyKgChange.toFixed(2)} kg/week approx`,
    macros: {
      proteinGrams,
      proteinCalories,
      proteinPercent: Math.round((proteinCalories / targetCalories) * 100),
      carbsGrams,
      carbsCalories,
      carbsPercent: Math.round((carbsCalories / targetCalories) * 100),
      fatGrams,
      fatCalories,
      fatPercent: Math.round((fatCalories / targetCalories) * 100),
    },
  };
}

function getDietSuggestions(gender, goalAdjustment, calories) {
  const isCutting = goalAdjustment < 0;
  const isGaining = goalAdjustment > 0;
  const genderNote = gender === "female"
    ? "Iron, calcium, protein aur hydration par extra dhyan rakho."
    : "Protein, fiber aur controlled carbs ko stable rakho.";

  return {
    title: `${Math.round(calories)} kcal target ke liye practical Indian gym diet ideas.`,
    items: [
      {
        title: "Protein base",
        detail: "Paneer/tofu, eggs, chicken, fish, dal, chana, soy chunks, curd. Har meal me protein source rakho.",
      },
      {
        title: "Carb timing",
        detail: isCutting
          ? "Roti/rice/oats/poha ko workout ke aas-paas rakho, late-night extra snacks avoid karo."
          : "Workout se pehle banana/oats/poha, workout ke baad rice/roti + protein helpful rahega.",
      },
      {
        title: "Fats and recovery",
        detail: "Nuts, seeds, peanut butter, olive/mustard oil measured quantity me. Deep fried food regular mat rakho.",
      },
      {
        title: "Goal focus",
        detail: isGaining
          ? "Calories add karne ke liye milk, curd, rice, potatoes, nuts aur extra roti use karo."
          : "Calories cut karte hue vegetables, salad, soups, lean protein aur high-fiber foods badhao.",
      },
      {
        title: "Gender note",
        detail: genderNote,
      },
      {
        title: "Silver Gym rule",
        detail: "Weight training ke saath 7-8 hours sleep, 2-3L water, aur weekly weight tracking maintain karo.",
      },
    ],
  };
}

function NumberField({ label, value, suffix, onChange, ...props }) {
  return (
    <div>
      <label className="calorie-label">{label}</label>
      <div className="calorie-input-wrap">
        <Input
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
        <span>{suffix}</span>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="calorie-info-tile">
      <Icon className="size-4 text-primary" />
      <div>
        <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, description, featured }) {
  return (
    <Card className={featured ? "calorie-result-card is-featured" : "calorie-result-card"}>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
            <div className="mt-2 text-3xl font-semibold">
              <CountingNumber to={value} duration={900} />
              <span className="text-sm font-medium text-muted-foreground"> kcal</span>
            </div>
            <div className="mt-2 text-xs leading-5 text-muted-foreground">{description}</div>
          </div>
          <div className="calorie-result-icon">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MacroRow({ label, value, calories, percent }) {
  return (
    <div className="macro-row">
      <div className="macro-row-top">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-muted-foreground">{value}g / {calories} kcal</div>
        </div>
        <div className="text-sm font-semibold text-primary">{percent}%</div>
      </div>
      <Progress className="mt-3" value={percent} />
    </div>
  );
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export { CalorieCalculatorSection };
