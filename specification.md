# TODO List Manager Application Specification

## Overview

A command-line TODO list manager in JavaScript.  
The application manages a list of tasks, stored on disk, and supports manipulation via command-line arguments.  
No interactive menu; the program processes a single command and exits.

## Task Object Structure

- `title`: string, unique, required
- `desc`: string, optional
- `priority`: int, positive, default 5 (lower is higher priority)
- `deadline`: string, ISO 8601 date (`yyyy-mm-dd`), default today
- `done`: bool, true if completed

## Functionality & Commands

### 1. Add Task

**Command:** `add`  
**Params:**

- `-t`/`--title` (string, required)
- `--desc` (string, optional)
- `-p`/`--priority` (int, optional, default 5)
- `-d`/`--deadline` (string, optional, default today)

**Behavior:**  
Adds a new task. Ignores if title missing.

### 2. Remove Task

**Command:** `remove`  
**Params:**

- `-t`/`--title` (string, required)

**Behavior:**  
Removes task by title. If not found or missing, outputs message.

### 3. Mark Task as Done

**Command:** `done`  
**Params:**

- `-t`/`--title` (string, required)

**Behavior:**  
Marks task as done by title. If not found or missing, outputs message.

### 4. List Tasks

**Command:** `list`  
**Params:**

- `-d`/`--deadline` (string, optional)
- `--done` (flag, optional)
- `--today` (flag, optional)
- `--tomorrow` (flag, optional)

**Behavior:**  
Lists tasks by criteria.

- If no params: lists all tasks.
- If `--done`: lists completed tasks.
- If `--today`/`--tomorrow`: lists tasks for today/tomorrow.
- If both `--deadline` and `--today`/`--tomorrow` present, only `--deadline` is used.

### 5. Help

**Command:** `-h`/`--help`  
**Behavior:**  
Outputs help text with all commands and options.

## Storage

- Tasks are persisted to a file on disk.

## Error Handling

- Missing required params: no action, output message.
- Non-existent task for remove/done: output message.

## Input Format

- All commands and options are provided as command-line arguments.
