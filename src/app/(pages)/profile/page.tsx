import EditPasswordSection from "@/components/functional/EditPasswordSection";
import EditProfileSection from "@/components/functional/EditProfileSection";
import ProfileSection from "@/components/functional/ProfileSection";

export const metadata = {
  title: "My Profile",
  description: "Profile Page",
};

export default function Profile() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold mt-14">Profil Saya</h1>
      <ProfileSection />
      <EditProfileSection />
      <EditPasswordSection />
    </section>
  );
}
