import React, { Component } from "react";
import "./App.css";
import http from "./services/httpService";
import config from "./config.json";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    posts: []
  };
  async componentDidMount() {
    try {
      const promise = http.get(config.apiEndPoint);
      const { data: posts } = await promise;
      this.setState({ posts });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Resource not found");
      this.setState({ posts: [] });
    }
  }
  handleAdd = async () => {
    /**Pessimistic operation */
    // const obj = { title: "a", body: "b" };
    // const { data: post } = await http.post(config.apiEndPoint, obj);
    // console.log(post);
    // const posts = [post, ...this.state.posts];
    // this.setState({ posts });

    /**Optimistic  operation */
    const originalPosts = this.state.posts;
    const obj = { title: "a", body: "b" };
    const posts = [obj, ...originalPosts];
    this.setState({ posts });
    try {
      const { data: post } = await http.post("s" + config.apiEndPoint, obj);
      const posts = [post, ...originalPosts];
      this.setState({ posts });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("adding Post failed: Resource not found");
      this.setState({ posts: originalPosts });
    }
  };

  handleDelete = async post => {
    /**Pessimistic operation */
    // await http.delete(config.apiEndPoint + "/" + post.id);
    // const posts = this.state.posts.filter(p => p.id !== post.id);
    // this.setState({ posts });

    /**Optimistic  operation */
    const originalPosts = this.state.posts;
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });
    try {
      await http.delete(config.apiEndPoint + "/" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Deleting Post failed: Resource not found");
      this.setState({ posts: originalPosts });
    }
  };

  handleUpdate = async originalPost => {
    /**Pessimistic operation */
    // post.title = "UPDATED";
    // await http.put(config.apiEndPoint + "/" + post.id, post);
    // const posts = [...this.state.posts];
    // const index = posts.indexOf(post);
    // posts[index] = { ...post };
    // this.setState({ posts });

    /**Optimistic  operation */
    const originalPosts = this.state.posts;
    const post = { ...originalPost };
    post.title = "UPDATED";
    const posts = [...originalPosts];
    const index = posts.indexOf(originalPost);
    posts[index] = { ...post };
    this.setState({ posts });
    try {
      await http.patch(config.apiEndPoint + "/" + post.id, post);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Deleting Post failed: Resource not found");
      this.setState({ posts: originalPosts });
    }
  };
  render() {
    return (
      <div className="container">
        <ToastContainer />
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
              <th>
                <button className="btn btn-primary" onClick={this.handleAdd}>
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => {
              return (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => this.handleUpdate(post)}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleDelete(post)}
                    >
                      Delete
                    </button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
