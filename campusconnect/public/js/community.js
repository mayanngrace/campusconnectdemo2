const API = "/posts";
let userRole = "student";

async function checkUserRole() {
    try {
        const res = await fetch("/me");
        if (res.ok) {
            const data = await res.json();
            userRole = data.role;
            if (userRole === "admin") {
                const addSection = document.getElementById("addPostSection");
                if (addSection) addSection.style.display = "none";
            }
        }
    } catch (e) {
        console.error("Failed to fetch user role", e);
    }
}

async function loadPosts() {
    const res = await fetch(API);
    let data = await res.json();

    const filterCategory = document.getElementById("filterCategory").value;
    const searchTitle = document.getElementById("searchTitle").value.toLowerCase();

    if (filterCategory !== "All") {
        data = data.filter(post => post.category === filterCategory);
    }

    if (searchTitle) {
        data = data.filter(post => post.title.toLowerCase().includes(searchTitle));
    }

    const list = document.getElementById("postList");
    list.innerHTML = "";

    data.forEach(post => {
        const li = document.createElement("li");
        li.className = "post-item";

        const leftDiv = document.createElement("div");
        leftDiv.className = "post-item-left";

        const titleSpan = document.createElement("span");
        titleSpan.className = "post-item-title";
        titleSpan.innerText = post.title;

        const categorySpan = document.createElement("span");
        categorySpan.className = "post-item-category";
        categorySpan.innerText = post.category;

        leftDiv.appendChild(titleSpan);
        leftDiv.appendChild(categorySpan);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "post-item-delete";
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => deletePost(post._id);

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        
        list.appendChild(li);
    });
}

async function addPost() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category })
    });

    loadPosts();
}

async function deletePost(id) {
    await fetch(API + "/" + id, {
        method: "DELETE"
    });

    loadPosts();
}

async function init() {
    await checkUserRole();
    await loadPosts();
}

init();