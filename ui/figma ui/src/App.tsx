import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { ValueProposition } from "./components/ValueProposition";
import { PhoneOTPAuth } from "./components/PhoneOTPAuth";
import { NurseDetailsForm } from "./components/NurseDetailsForm";
import { NewDashboard } from "./components/NewDashboard";
import { Engage } from "./components/Engage";
import { EngageDetails } from "./components/EngageDetails";
import { NightingaleChampion } from "./components/NightingaleChampion";
import { CelebrationModal } from "./components/CelebrationModal";
import { NewsAnnouncements } from "./components/NewsAnnouncements";
import { DirectRegistration } from "./components/DirectRegistration";
import { Certifications } from "./components/Certifications";
import { BookingSlots } from "./components/BookingSlots";
import { RescheduleSession } from "./components/RescheduleSession";
import { SessionPreparation } from "./components/SessionPreparation";
import { VideoSession } from "./components/VideoSession";
import { SessionFeedback } from "./components/SessionFeedback";
import { OrderHistory } from "./components/OrderHistory";
import { Referral } from "./components/Referral";
import { MyLearning } from "./components/MyLearning";
import { Learning } from "./components/Learning";
import { LearningDetails } from "./components/LearningDetails";
import { CourseViewer } from "./components/CourseViewer";
import { EventViewer } from "./components/EventViewer";
import { WorkshopViewer } from "./components/WorkshopViewer";
import { Rewards } from "./components/Rewards";
import { Payment } from "./components/Payment";
import { MentorshipSessions } from "./components/MentorshipSessions";
import { MentorProfile } from "./components/MentorProfile";
import { Profile } from "./components/Profile";
import { ProfileEdit } from "./components/ProfileEdit";
import { Notifications } from "./components/Notifications";
import { Help } from "./components/Help";
import { BottomNav } from "./components/BottomNav";

export default function App() {
  const [appState, setAppState] = useState<{
    showSplash: boolean;
    hasSeenOnboarding: boolean;
    isAuthenticated: boolean;
    hasCompletedProfile: boolean;
    profileIncomplete: boolean;
    currentPage: string;
    pageData?: any;
  }>({
    showSplash: true,
    hasSeenOnboarding: false,
    isAuthenticated: false,
    hasCompletedProfile: false,
    profileIncomplete: false,
    currentPage: "dashboard",
    pageData: null,
  });

  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    points?: number;
    icon?: "award" | "gift" | "star";
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    // Check localStorage for saved state
    const onboardingStatus = localStorage.getItem(
      "hasSeenOnboarding",
    );
    const authStatus = localStorage.getItem("isAuthenticated");
    const profileStatus = localStorage.getItem(
      "hasCompletedProfile",
    );
    const profileIncompleteStatus = localStorage.getItem(
      "profileIncomplete",
    );

    setAppState((prev) => ({
      ...prev,
      hasSeenOnboarding: onboardingStatus === "true",
      isAuthenticated: authStatus === "true",
      hasCompletedProfile: profileStatus === "true",
      profileIncomplete: profileIncompleteStatus === "true",
    }));
  }, []);

  const handleSplashComplete = () => {
    setAppState((prev) => ({ ...prev, showSplash: false }));
  };

  const handleOnboardingComplete = () => {
    setAppState((prev) => ({
      ...prev,
      hasSeenOnboarding: true,
    }));
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const handleAuth = () => {
    setAppState((prev) => ({ ...prev, isAuthenticated: true }));
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleProfileComplete = (data: any, isSkipped?: boolean) => {
    console.log("Profile data:", data, "Skipped:", isSkipped);
    setAppState((prev) => ({
      ...prev,
      hasCompletedProfile: true,
      profileIncomplete: isSkipped ? true : false,
    }));
    localStorage.setItem("hasCompletedProfile", "true");
    
    // If profile was skipped, store that information for later prompt
    if (isSkipped) {
      localStorage.setItem("profileIncomplete", "true");
    } else {
      localStorage.removeItem("profileIncomplete");
    }
  };

  const handleNavigate = (page: string, data?: any) => {
    setAppState((prev) => ({
      ...prev,
      currentPage: page,
      pageData: data,
    }));
  };

  const handleCelebrate = (data: {
    title: string;
    message: string;
    points?: number;
    icon?: "award" | "gift" | "star";
  }) => {
    setCelebration({
      isOpen: true,
      ...data,
    });
  };

  // Splash Screen
  if (appState.showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Onboarding (Value Proposition)
  if (!appState.hasSeenOnboarding) {
    return (
      <ValueProposition onComplete={handleOnboardingComplete} />
    );
  }

  // Authentication
  if (!appState.isAuthenticated) {
    return <PhoneOTPAuth onAuth={handleAuth} />;
  }

  // Profile Completion
  if (!appState.hasCompletedProfile) {
    return (
      <NurseDetailsForm onComplete={handleProfileComplete} />
    );
  }

  // Main App Navigation
  const showBottomNav = [
    "dashboard",
    "learning",
    "my-learning",
    "engage",
    "sessions",
    "mentorship",
  ].includes(appState.currentPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Content */}
      {appState.currentPage === "dashboard" && (
        <NewDashboard
          onNavigate={handleNavigate}
          userExperience={6}
          profileIncomplete={appState.profileIncomplete}
        />
      )}
      {appState.currentPage === "complete-profile" && (
        <NurseDetailsForm onComplete={(data, isSkipped) => {
          handleProfileComplete(data, isSkipped);
          if (!isSkipped) {
            // Profile fully completed, remove incomplete flag
            localStorage.removeItem("profileIncomplete");
            setAppState(prev => ({ ...prev, profileIncomplete: false }));
          }
          handleNavigate("dashboard");
        }} />
      )}
      {appState.currentPage === "news" && (
        <NewsAnnouncements onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "direct-registration" && (
        <DirectRegistration
          onNavigate={handleNavigate}
          onCelebrate={handleCelebrate}
        />
      )}
      {appState.currentPage === "engage" && (
        <Engage onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "engage-details" && (
        <EngageDetails
          onNavigate={handleNavigate}
          engageData={appState.pageData}
        />
      )}
      {appState.currentPage === "champion" && (
        <NightingaleChampion
          onNavigate={handleNavigate}
          onCelebrate={handleCelebrate}
        />
      )}
      {appState.currentPage === "rewards" && (
        <Rewards onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "payment" && (
        <Payment
          onNavigate={handleNavigate}
          paymentData={appState.pageData}
          onCelebrate={handleCelebrate}
        />
      )}
      {(appState.currentPage === "mentorship" || appState.currentPage === "sessions") && (
        <MentorshipSessions onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "mentor-profile" && (
        <MentorProfile
          onNavigate={handleNavigate}
          mentorData={appState.pageData}
        />
      )}
      {appState.currentPage === "booking-slots" && (
        <BookingSlots
          onNavigate={handleNavigate}
          mentorData={appState.pageData}
        />
      )}
      {appState.currentPage === "reschedule-session" && (
        <RescheduleSession
          onNavigate={handleNavigate}
          sessionData={appState.pageData}
          onCelebrate={handleCelebrate}
        />
      )}
      {appState.currentPage === "session-preparation" && (
        <SessionPreparation
          onNavigate={handleNavigate}
          sessionData={appState.pageData}
        />
      )}
      {appState.currentPage === "video-session" && (
        <VideoSession
          onNavigate={handleNavigate}
          sessionData={appState.pageData}
          onCelebrate={handleCelebrate}
        />
      )}
      {appState.currentPage === "session-feedback" && (
        <SessionFeedback
          onNavigate={handleNavigate}
          sessionData={appState.pageData}
          onCelebrate={handleCelebrate}
        />
      )}
      {appState.currentPage === "my-learning" && (
        <MyLearning onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "learning" && (
        <Learning onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "learning-details" && (
        <LearningDetails
          onNavigate={handleNavigate}
          learningData={appState.pageData}
        />
      )}
      {appState.currentPage === "course-viewer" && (
        <CourseViewer
          onNavigate={handleNavigate}
          courseData={appState.pageData}
        />
      )}
      {appState.currentPage === "event-viewer" && (
        <EventViewer
          onNavigate={handleNavigate}
          eventData={appState.pageData}
        />
      )}
      {appState.currentPage === "workshop-viewer" && (
        <WorkshopViewer
          onNavigate={handleNavigate}
          workshopData={appState.pageData}
        />
      )}
      {appState.currentPage === "profile" && (
        <Profile 
          onNavigate={handleNavigate}
          profileIncomplete={appState.profileIncomplete}
        />
      )}
      {appState.currentPage === "profile-edit" && (
        <ProfileEdit 
          onNavigate={handleNavigate}
          onSave={(data) => {
            // Update profile data
            localStorage.setItem('nurseProfile', JSON.stringify(data));
            // Check if profile is now complete
            if (data.currentWorkplace && data.registrationNumber && data.highestQualification) {
              localStorage.removeItem('profileIncomplete');
              setAppState(prev => ({ ...prev, profileIncomplete: false }));
            }
          }}
          profileIncomplete={appState.profileIncomplete}
        />
      )}
      {appState.currentPage === "certifications" && (
        <Certifications onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "order-history" && (
        <OrderHistory onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "referral" && (
        <Referral onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "notifications" && (
        <Notifications onNavigate={handleNavigate} />
      )}
      {appState.currentPage === "help" && (
        <Help onNavigate={handleNavigate} />
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          currentPage={
            appState.currentPage === "dashboard"
              ? "dashboard"
              : appState.currentPage === "my-learning" || appState.currentPage === "learning"
                ? "learning"
                : appState.currentPage === "engage"
                  ? "engage"
                  : appState.currentPage === "sessions" || appState.currentPage === "mentorship"
                    ? "sessions"
                    : appState.currentPage
          }
          onNavigate={(page) => {
            const pageMap: Record<string, string> = {
              dashboard: "dashboard",
              learning: "learning",
              engage: "engage",
              sessions: "sessions",
            };
            handleNavigate(pageMap[page] || page);
          }}
        />
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() =>
          setCelebration((prev) => ({ ...prev, isOpen: false }))
        }
        title={celebration.title}
        message={celebration.message}
        points={celebration.points}
        icon={celebration.icon}
      />
    </div>
  );
}