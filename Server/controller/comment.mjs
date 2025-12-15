import * as commentRepository from "../data/comment.mjs";

// 특정 업무의 댓글 목록 조회
export async function getComments(req, res, next) {
  try {
    const taskId = req.params.taskId;
    const comments = await commentRepository.getAllByTaskId(taskId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

// 댓글 작성
export async function createComment(req, res, next) {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const comment = await commentRepository.create(taskId, req.id, content);
    const populatedComment = await commentRepository.getById(comment.id);
    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
}

// 댓글 삭제
export async function deleteComment(req, res, next) {
  try {
    const id = req.params.id;
    const comment = await commentRepository.getById(id);
    if (!comment) {
      return res.status(404).json({ message: `댓글을 찾을 수 없습니다` });
    }
    
    // 작성자만 삭제 가능 (ID를 문자열로 비교)
    const writerId = String(comment.writerId?.id || comment.writerId?._id || "");
    const userId = String(req.id || "");
    if (writerId !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다" });
    }
    
    await commentRepository.remove(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

