## Login and SignUp Page Details

### SignUp Page
The SignUp page allows users to create a new account. The user details are collected through a form and stored in both Firebase Authentication and Firestore database.

- **User Details Collection**: The form collects the user's username, email, password, and role (default is 'user').
- **Firebase Authentication**: The user's email and password are used to create a new user in Firebase Authentication.
- **Firestore Database**: Additional user details (username, email, role, and creation timestamp) are stored in the Firestore database under the "users" collection.

### Login Page
The Login page allows users and admins to log in to their accounts. The login process differs for users and admins.

- **Admin Login**:
  - Admin details are stored only in the Firestore database under the "admin" collection.
  - The admin's username and password are verified against the stored details in Firestore.
  - On successful login, admin details are stored in `localStorage` and the user is redirected to the home page.

- **User Login**:
  - User details are stored in both Firebase Authentication and Firestore database.
  - The user's email and password are verified using Firebase Authentication.
  - On successful login, user details are stored in `localStorage` and the user is redirected to the home page.

### Admin Login Process
In the admin login process, the following steps are performed:

1. **Document Reference (`docRef`)**: A reference to the admin document in the Firestore database is created using the `doc` function. The `doc` function takes three arguments: the Firestore database instance (`db`), the collection name (`"admin"`), and the document ID (`userName`).

   ```javascript
   const documentRef = doc(db, "admin", userName);
   ```

2. **Retrieve Document (`getDoc`)**: The `getDoc` function is used to retrieve the document from Firestore. It takes the document reference (`documentRef`) as an argument and returns a document snapshot (`docSnap`).

   ```javascript
   const docSnap = await getDoc(documentRef);
   ```

3. **Check Document Existence**: The `exists` method of the document snapshot is used to check if the document exists in Firestore.

   ```javascript
   if (docSnap.exists()) {
   ```

4. **Extract Data**: If the document exists, the `data` method of the document snapshot is used to extract the document data. The extracted data includes the admin's password (`dbPass`) and email (`dbEmail`).

   ```javascript
   const data = docSnap.data();
   const dbPass = data.password;
   const dbEmail = data.email;
   ```

5. **Verify Password**: The provided password is compared with the stored password (`dbPass`). If they match, the admin is successfully logged in.

   ```javascript
   if (dbPass === password) {
     localStorage.setItem("isAdmin", true);
     localStorage.setItem("username", userName);
     localStorage.setItem("email", dbEmail);
     toast.success("Successful login", 1000);
     navigate("/");
   } else {
     toast.error("Invalid email or password", 1000);
   }
   ```

### Code Snippets

#### SignUp Page
```jsx
// ...existing code...
const handleAddUser = async () => {
  try {
    if (password === confirmPassword) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userDetails = {
        userName: userName,
        email: email,
        role: role,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userDetails);
      toast("Successfully signed up");
      navigate("/register", { state: { userName, email, password, role } });
    } else {
      alert("Passwords do not match!");
    }
  } catch (error) {
    console.error("Error during email/password sign up:", error.message);
    toast("Error during sign up. Please try again.");
  }
};
// ...existing code...
```

#### Login Page
```jsx
// ...existing code...
const handleLogin = async () => {
  try {
    if (userName.trim() !== "" && password.trim() !== "") {
      if (role === "admin") {
        const documentRef = doc(db, "admin", userName);
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.password === password) {
            localStorage.setItem("isAdmin", true);
            localStorage.setItem("username", userName);
            localStorage.setItem("email", data.email);
            toast.success("Successful login", 1000);
            navigate("/");
          } else {
            toast.error("Invalid email or password", 1000);
          }
        } else {
          toast.error("User not found", 1000);
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, userName, password);
        const user = userCredential.user;
        localStorage.setItem("isAdmin", false);
        localStorage.setItem("username", user.displayName || user.email);
        localStorage.setItem("email", user.email);
        toast.success("Successful login", 1000);
        navigate("/");
      }
    } else {
      toast.error("Please enter all the details", 1000);
    }
  } catch (error) {
    console.error("Error during login:", error);
    toast.error("Error during login. Please check your credentials.", 1000);
  }
};
// ...existing code...
```

## Blog Management Details

### AddBlog Page
The AddBlog page allows users to contribute to the blog by submitting their own articles. The submitted blogs are stored in the Firestore database and require admin approval before being published.

- **Form Submission**: Users fill out a form with the following details:
  - **Title**: The title of the blog.
  - **Subtitle**: A brief subtitle or subject of the blog.
  - **Author Name**: The name of the author.
  - **Image Link**: A link to an image related to the blog.
  - **Blog Content**: The main content of the blog.
- **User Email**: The email of the user submitting the blog is automatically retrieved from `localStorage`.
- **Blog Data Storage**: The blog data, along with a timestamp and a status of "notapproved", is stored in the Firestore database under the "blogs" collection.
- **Admin Approval**: The blog will be added to the database but will only be visible to users after an admin approves it.

### Blogs Page
The Blogs page displays a list of all approved blogs. Only blogs that have been approved by an admin are shown to users.

- **Fetch Approved Blogs**: The blogs are fetched from the Firestore database where the status is "approved".
- **Display Blogs**: Each blog is displayed with its title, subtitle, image, and publication date. Users can click on a blog to read the full content.

### ReadBlog Page
The ReadBlog page allows users to read individual blog posts. The blog data is fetched from the Firestore database based on the blog ID provided in the URL.

- **Fetch Blog Data**: The blog data is fetched from the Firestore database using the blog ID.
- **Display Blog**: The blog details, including the title, subtitle, image, content, author name, and email, are displayed to the user.
- **Publication Date**: The publication date of the blog is shown based on the timestamp stored in the database.
- **Admin Actions**: Admins can accept or discard blogs by changing the status of the blog in the Firestore database.

### Blog Approval Process
The blog approval process involves the following steps:

1. **Blog Submission**: When a user submits a blog through the AddBlog page, the blog data is stored in the Firestore database with a status of "notapproved".
2. **Admin Review**: An admin reviews the submitted blogs and changes the status to "approved" if the blog meets the required standards. Admins can also discard blogs by changing the status to "discarded".
3. **Blog Visibility**: Only blogs with a status of "approved" are visible to users on the Blogs and ReadBlog pages.

### Code Snippets

#### AddBlog Page
```jsx

// ...existing code...
const handleSubmit = async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const userEmail = localStorage.getItem("email");

  // Validate required fields
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const authname = formData.get("authname");
  const imgLink = formData.get("img-link");
  const blogContent = formData.get("blogcontent");

  if (!title || !subtitle || !authname || !imgLink || !blogContent) {
    alert("Please fill out all required fields.");
    return;
  }

  const blogData = {
    title,
    subtitle,
    blogContent,
    email: userEmail,
    authname,
    timestamp: serverTimestamp(),
    imglink: imgLink,
    status: "notapproved",
  };

  try {
    await addDoc(collection(db, "blogs"), blogData);
    alert("Your Blog will be added once admin approves it");
    navigate("/blogs");
  } catch (error) {
    console.error("Error:", error);
    alert("Error occurred while adding the blog.");
  }
};
// ...existing code...
```

#### Blogs Page
```jsx

// ...existing code...
useEffect(() => {
  const fetchData = async () => {
    try {
      const q = query(
        collection(getFirestore(), "blogs"),
        where("status", "==", "approved")
      );
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
// ...existing code...
```

#### ReadBlog Page
```jsx
// ...existing code...
useEffect(() => {
  const fetchBlog = async () => {
    try {
      const blogDoc = await getDoc(doc(db, "blogs", id)); // id from useparams url
      if (blogDoc.exists()) {
        setBlog(blogDoc.data());
      } else {
        console.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  fetchBlog();
}, [id]);

if (!blog) {
  return <div>Loading...</div>; // or show a loading spinner
}
return (
  <>
  <Navbar />
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
          {blog.title}
        </h1>
        <h1 className="mb-4 text-center text-lg font-semibold text-gray-400 italic sm:text-xl md:mb-6">
          {blog.subtitle}
        </h1>

        <div className="relative mb-6 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:mb-8">
          <img
            src={blog.imglink}
            loading="lazy"
            alt={`${blog.title}`}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4">
          Blog
        </h2>

        <p className="mb-6 text-gray-500 max-w-screen-xl text-justify sm:text-lg md:mb-8 border-l-4 border-green-800 p-4">{blog.blogContent}</p>

        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 align-middle items-center flex ">
          <IonIcon icon={personOutline} className="p-2"></IonIcon>
          <span className="text-lg text-green-800"> {blog.authname} </span>
        </h2>
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 align-middle items-center flex">
          <IonIcon icon={mailOutline} className="p-2"></IonIcon>
          <span className="text-lg text-green-800">{blog.email}</span>
        </h2>

        <p className="text-gray-500 sm:text-md">Published on: {new Date(blog.timestamp.seconds * 1000).toLocaleString()}</p>

        {isAdmin && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={async () => {
                await updateDoc(doc(db, "blogs", id), { status: "approved" });
                alert("Blog approved");
                navigate("/blogs");
              }}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={async () => {
                await updateDoc(doc(db, "blogs", id), { status: "discarded" });
                alert("Blog discarded");
                navigate("/blogs");
              }}
            >
              Discard
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);
// ...existing code...
```

## User Profile Functionality

The user profile functionality in WasteWiseWeb allows users to view and manage their personal information, hosted campaigns, blogs, certificates, and upcoming campaigns. Below is a detailed explanation of how each component works:

### UserDetails Component

The `UserDetails` component fetches and displays the user's personal information from the Firestore database. It also provides options for the user to log out and navigate to the feedback page.

- **Fetching User Data**: The component fetches user data based on the username stored in local storage. It checks if the user is an admin or a regular user and fetches data from the respective collection (`admin` or `users`).
- **Displaying User Data**: The component displays the user's username, name, Aadhar number, date of birth, contact information, state, city, email, and the date the user joined.
- **Logout Functionality**: The user can log out by clicking the "Logout" button, which removes the username and email from local storage and navigates the user to the home page.
- **Feedback Navigation**: The user can navigate to the feedback page by clicking the "Feedback" button.

### UserBlogs Component

The `UserBlogs` component fetches and displays the blogs written by the user.

- **Fetching Blogs**: The component fetches blogs from the Firestore database where the email matches the email stored in local storage.
- **Filtering Blogs**: The user can filter blogs by their approval status (all, approved, not approved).
- **Displaying Blogs**: The component displays the blogs in a grid format. If no blogs are found, a message is displayed, and the user is prompted to add a new blog.

### UserCampaign Component

The `UserCampaign` component fetches and displays the campaigns hosted by the user.

- **Fetching Campaigns**: The component fetches campaigns from the Firestore database where the user's email matches the email stored in local storage.
- **Filtering Campaigns**: The user can filter campaigns by their approval status (approved, not approved, all).
- **Displaying Campaigns**: The component displays the campaigns in a list format. If no campaigns are found, a message is displayed, and the user is prompted to request a new campaign.

### UserCertificates Component

The `UserCertificates` component fetches and displays the certificates earned by the user.

- **Fetching Certificates**: The component fetches the user's certificates from the Firestore database based on the username stored in local storage.
- **Displaying Certificates**: The component displays a table of certificates with options to download each certificate.
- **Downloading Certificates**: The user can download a certificate by clicking the "Download" button, which navigates the user to the certificate page with the necessary details.

### UserUpcomingCampaign Component

The `UserUpcomingCampaign` component fetches and displays the upcoming campaigns the user has registered for.

- **Fetching Campaigns**: The component fetches all campaigns from the Firestore database and filters them based on the user's username and upcoming dates.
- **Displaying Campaigns**: The component displays the upcoming campaigns in a list format. If no upcoming campaigns are found, a message is displayed.

### Local Storage Usage

The application uses local storage to store the user's username and email. This information is used to fetch the user's data from the Firestore database and personalize the user experience.

### Firestore Database Structure

The Firestore database contains the following collections relevant to the user profile functionality:

- `users`: Stores user data for regular users.
- `admin`: Stores user data for admin users.
- `blogs`: Stores blog data.
- `requests`: Stores campaign data.

### Navigation

The application uses React Router for navigation. The user can navigate between different pages such as the user profile, feedback, add blog, request campaign, and certificate pages.
