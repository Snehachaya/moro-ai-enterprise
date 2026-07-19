import { useEffect, useMemo, useState } from "react";
import { Edit3, KeyRound, Save, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useAuthStore, type UserProfile } from "@/store/authStore";

const emptyProfile: UserProfile = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  workspace: "",
};

function getInitials(profile: UserProfile | null) {
  const source = profile?.fullName || profile?.email || "";
  const initials = source
    .split(/[.\s_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "--";
}

export function ProfileDetails() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);

  const defaultValues = useMemo<UserProfile>(
    () => ({
      ...emptyProfile,
      email: user?.email ?? "",
      ...profile,
    }),
    [profile, user?.email],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: values.role.trim(),
      workspace: values.workspace.trim(),
    });
    setIsEditing(false);
  });

  const profileFields = [
    { label: "Full Name", value: profile?.fullName },
    { label: "Email Address", value: profile?.email },
    { label: "Phone Number", value: profile?.phone },
    { label: "Assigned Role", value: profile?.role, emphasis: true },
    { label: "Workspace", value: profile?.workspace },
  ];
  const isProfileFormVisible = !profile || isEditing;

  return (
    <section>
      <Card className="overflow-hidden rounded-lg border-borderSubtle bg-[#0b0f14]/95">
        <CardContent className="grid gap-7 p-6 md:p-8 lg:grid-cols-[150px_minmax(0,1fr)]">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-cyan-300/30 bg-[radial-gradient(circle_at_35%_20%,rgba(6,182,212,0.55),transparent_32%),linear-gradient(135deg,#0f172a,#111827_45%,#020817)] shadow-[0_0_35px_rgba(6,182,212,0.18)]">
            <div className="absolute inset-4 rounded-xl border border-cyan-300/20 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-400/20 to-transparent" />
            <div className="absolute bottom-4 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border border-cyan-200/30 bg-slate-900 text-xl font-semibold text-white">
              {profile ? getInitials(profile) : <UserRound className="h-7 w-7 text-cyan-100" aria-hidden="true" />}
            </div>
            <button
              type="button"
              aria-label="Edit profile photo"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-slate-100 shadow-lg"
            >
              <Edit3 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6">
            {isProfileFormVisible ? (
              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <h3 className="text-xl font-semibold text-white">{profile ? "Edit Profile" : "Complete Your Profile"}</h3>
                  <p className="mt-2 text-sm text-slate-400">Add your details once to personalize your MoroAI workspace.</p>
                </div>
                <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
                  <FormField label="Full name" htmlFor="profileFullName" error={errors.fullName?.message}>
                    <Input
                      id="profileFullName"
                      autoComplete="name"
                      hasError={Boolean(errors.fullName)}
                      {...register("fullName", { required: "Full name is required." })}
                    />
                  </FormField>
                  <FormField label="Email address" htmlFor="profileEmail" error={errors.email?.message}>
                    <Input
                      id="profileEmail"
                      type="email"
                      autoComplete="email"
                      hasError={Boolean(errors.email)}
                      {...register("email", {
                        required: "Email address is required.",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
                      })}
                    />
                  </FormField>
                  <FormField label="Phone number" htmlFor="profilePhone" error={errors.phone?.message}>
                    <Input
                      id="profilePhone"
                      autoComplete="tel"
                      hasError={Boolean(errors.phone)}
                      {...register("phone", { required: "Phone number is required." })}
                    />
                  </FormField>
                  <FormField label="Assigned role" htmlFor="profileRole" error={errors.role?.message}>
                    <Input
                      id="profileRole"
                      autoComplete="organization-title"
                      hasError={Boolean(errors.role)}
                      {...register("role", { required: "Assigned role is required." })}
                    />
                  </FormField>
                  <FormField label="Workspace" htmlFor="profileWorkspace" error={errors.workspace?.message}>
                    <Input
                      id="profileWorkspace"
                      autoComplete="organization"
                      hasError={Boolean(errors.workspace)}
                      {...register("workspace", { required: "Workspace is required." })}
                    />
                  </FormField>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Save Profile
                  </Button>
                  {profile ? (
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  ) : null}
                  <Button type="button" variant="secondary">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    Change Password
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
                  {profileFields.map((field) => (
                    <div key={field.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{field.label}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {field.emphasis ? <span className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
                        <p className={field.emphasis ? "font-semibold text-cyan-200" : "font-medium text-white"}>
                          {field.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button variant="secondary" className="border-cyan-300/60 text-cyan-100 hover:bg-cyan-300/10" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="secondary">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    Change Password
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
