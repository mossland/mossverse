// import { CommentService } from "./comment.service";
// import { TestSystem } from "@shared/test-server";
// import { CommentModule } from "./comment.module";
//
// import * as sample from "../sample";
// import * as db from "../db";
// import * as srv from "../srv";
// import * as gql from "../gql";
// import { registerModules } from "../module";
// describe("Comment Service", () => {
//   const system = new TestSystem();
//   let commentService: CommentService;
//   beforeAll(async () => {
//     const app = await system.init(registerModules);
//     commentService = app.get<CommentService>(CommentService);
//   });
//   afterAll(async () => await system.terminate());
//   let comment: db.Comment.Doc;
//   let input: gql.CommentInput;
//   it("Create Comment", async () => {
//     input = sample.commentInput();
//     comment = await commentService.create(input);
//     expect(comment.status).toEqual("active");
//     expect(comment).toEqual(expect.objectContaining(input));
//   });
//   it("Update Comment", async () => {
//     input = sample.commentInput();
//     comment = await commentService.update(comment._id, input);
//     expect(comment).toEqual(expect.objectContaining(input));
//   });
//   it("Remove Comment", async () => {
//     comment = await commentService.remove(comment._id);
//     expect(comment.status).toEqual("inactive");
//   });
// });
