const fs = require("fs");

const fetchData = async (path) => {
    try {
        const resp = await fetch("https://jsonplaceholder.typicode.com" + path);
        return resp.json();
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getData = async () => {
    const [userList, postList, commentsList] = await Promise.all([
        fetchData("/users"),
        fetchData("/posts"),
        fetchData("/comments"),
    ]);

    // định dạng lại dữ liệu
    userList.forEach((user) => {
        return {
            ...user,
            comments: postList.filter((post) => post.userId === user.id),
            posts: commentsList.filter((comment) => comment.email === user.email),
        };
    });

    fs.writeFileSync("userList.json", JSON.stringify(userList, null, 2));

    //chọn ngời có nhiều hơn 3 comment
    const userListMoreThan3Comment = userList.filter((user) => user.comments.length > 3);
    fs.writeFileSync("userListMoreThan3Comment.json", JSON.stringify(userListMoreThan3Comment, null, 2));

    // định dạng lại data đếm số cmt và post
    userList.forEach((user) => {
        user.comments = user.comments.length;
        user.posts = user.posts.length;
        return user;
    });
    fs.writeFileSync("userListAfterCount.json", JSON.stringify(userList, null, 2));

    //người có nhiều bình luận, bài đăng nhất
    const userMostComment = [...userList].sort((a, b) => b.comments - a.comments)[0];
    const userMostPost = [...userList].sort((a, b) => b.posts - a.posts)[0];

    //sắp xếp post count giảm dần
    const sortPost = [...userList].sort((a, b) => b.posts - a.posts);

    //8
    const [postId1, commentsWithPostId] = await Promise.all([fetchData("/posts/1"), fetchData("/comments?postId=1")]);
    const dataAfterFormat = {
        ...postId1,
        comments: commentsWithPostId,
    };
    fs.writeFileSync("dataAfterFormat.json", JSON.stringify(dataAfterFormat, null, 2));
};
getData();
