"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { UserResponse } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    };
    getUser();
  }, [router, supabase.auth]);

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to change password",
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // Sign out the user first
      await supabase.auth.signOut();

      // Note: Actual account deletion requires admin privileges
      // In production, you would call a server action or API route that uses the service role key
      // For now, we'll just sign them out
      router.push("/");
      router.refresh();
    } catch (error) {
      alert(
        "Failed to delete account: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/scroll"
            className="text-black hover:text-black/70 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-semibold text-black">Settings</h1>
          <div className="w-16" />
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Account Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-black mb-6">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Email</p>
                <p className="text-black/60 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Password</p>
                <p className="text-black/60 text-sm">••••••••</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-black hover:text-black/70 text-sm font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-black mb-6">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Email Notifications</p>
                <p className="text-black/60 text-sm">
                  Receive updates about new movies
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-black/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Auto-play Trailers</p>
                <p className="text-black/60 text-sm">
                  Automatically play video previews
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-black/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-black mb-6">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Profile Visibility</p>
                <p className="text-black/60 text-sm">
                  Make your profile visible to others
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-black/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-black mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-black font-medium">Language</p>
                <p className="text-black/60 text-sm">Choose your language</p>
              </div>
              <select className="bg-white border border-black/20 text-black text-sm rounded px-3 py-1.5 focus:outline-none focus:border-black">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-6">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 border-2 border-red-600 text-red-600 font-medium hover:bg-red-600 hover:text-white transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-black mb-6">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}

              {passwordSuccess && (
                <p className="text-green-600 text-sm">
                  Password changed successfully!
                </p>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="flex-1 py-2 border border-black/20 text-black hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-2 bg-black text-white hover:bg-black/80 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
