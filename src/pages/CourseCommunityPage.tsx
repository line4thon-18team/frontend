import { useLocation, useNavigate } from "react-router";
import CourseCommunityChat from "../components/course-community/CourseCommunityChat";
import "../components/course-community/CourseCommunity.css";
import { settingsBackPath } from "../utils/navigation";

function CourseCommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = settingsBackPath(location.search);

  return (
    <div className="course-community-shell">
      <CourseCommunityChat
        onBack={() => navigate(backPath)}
        onViewCourse={() => navigate(backPath)}
      />
    </div>
  );
}

export default CourseCommunityPage;
