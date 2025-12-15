import * as taskRepository from "../data/task.mjs";

// 모든 업무를 가져오는 함수
export async function getTasks(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      assignee: req.query.assignee,
    };
    
    // 빈 필터 제거
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const tasks = await taskRepository.getAll(filters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

// 하나의 업무를 가져오는 함수
export async function getTask(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "업무 ID가 필요합니다" });
    }
    
    // MongoDB ObjectId 형식 검증 (더 유연한 처리)
    const mongoose = (await import("mongoose")).default;
    let taskId = id;
    
    // id가 유효하지 않은 경우, 다른 형식으로 시도
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // 이미 문자열로 변환된 ID일 수 있으므로 그대로 사용
      taskId = id;
    }
    
    const task = await taskRepository.getById(taskId);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: `업무를 찾을 수 없습니다` });
    }
  } catch (error) {
    console.error("업무 조회 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다", error: error.message });
  }
}

// 업무를 작성하는 함수
export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    const mongoose = (await import("mongoose")).default;
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };
    
    // assignee가 유효한 ObjectId인 경우에만 추가
    if (assignee && mongoose.Types.ObjectId.isValid(assignee)) {
      taskData.assignee = assignee;
    }
    
    const task = await taskRepository.create(taskData, req.id);
    const populatedTask = await taskRepository.getById(task.id);
    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
}

// 업무를 변경하는 함수
export async function updateTask(req, res, next) {
  try {
    const id = req.params.id;
    const task = await taskRepository.getById(id);
    if (!task) {
      return res.status(404).json({ message: `업무를 찾을 수 없습니다` });
    }
    
    // creator만 수정 가능 (ID를 문자열로 비교)
    const creatorId = String(task.creator?.id || task.creator?._id || "");
    const userId = String(req.id || "");
    if (creatorId !== userId) {
      return res.status(403).json({ message: "수정 권한이 없습니다" });
    }
    
    const { title, description, status, priority, assignee, dueDate } = req.body;
    const mongoose = (await import("mongoose")).default;
    const updateData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };
    
    // assignee가 유효한 ObjectId인 경우에만 추가
    if (assignee && mongoose.Types.ObjectId.isValid(assignee)) {
      updateData.assignee = assignee;
    } else if (assignee === "" || assignee === null) {
      updateData.assignee = null;
    }
    
    const updated = await taskRepository.update(id, updateData);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

// 업무를 삭제하는 함수
export async function deleteTask(req, res, next) {
  try {
    const id = req.params.id;
    const task = await taskRepository.getById(id);
    if (!task) {
      return res.status(404).json({ message: `업무를 찾을 수 없습니다` });
    }
    
    // creator 또는 admin만 삭제 가능 (ID를 문자열로 비교)
    const creatorId = String(task.creator?.id || task.creator?._id || "");
    const userId = String(req.id || "");
    const isAdmin = req.role === "admin";
    if (!isAdmin && creatorId !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다" });
    }
    
    await taskRepository.remove(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

