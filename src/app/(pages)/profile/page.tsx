import EditPasswordSection from "@/components/functional/EditPasswordSection";
import EditProfileSection from "@/components/functional/EditProfileSection";
import ProfileSection from "@/components/functional/ProfileSection";

export const metadata = {
  title: "My Profile",
  description: "Profile Page",
};

export default function Profile() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Profil Saya
      </h1>
      <ProfileSection />
      <EditProfileSection />
      <EditPasswordSection />
    </section>
  );
}
