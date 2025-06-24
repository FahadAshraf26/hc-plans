# Honeycombcredit Api

## Available Scripts

In the project directory, you can run:

### `npm install`

Install Dependencies

### `npm run dev`

Run Project

## Running Development Environment

We have provided a `Makefile` to manage the operations of docker-compose and development environment and make sure you have setted up all the variables in `.env` file on your local. please see the example .env

Quik run dev environment

```
make all
```

Build dev environment

```
make build
```

Run dev environment in background

```
make up
```

Tail logs for dev environment

```
make logs
```

Attach to the container

```
make attach
```

Clean up all resources

```
make clean
```

Kill containers

```
make kill
```

List running containers

```
make ps
```

## Running tests

Make sure that you have environment up and running before executing following command

```
make test
```

### Building the image

Once you have checked out to the relase `tag` or `branch` that you want to build, there is bash script that builds the image and uploads it to GCR repo

You can invoke the `ops/docker/bash.sh` as follows:

```
usage:  ./ops/docker/build.sh <command> <version>

Commands:
   images               Builds the images and pushes it to gcr

ENV_VARS:
 ===================================================================
        GCP_PROJECT             Default set to optimum-time-275617
```

(Note: Make sure you are in the root of the project due to the docker context)

## Important (Read before commit)

Implement the structure for Jira sprints and GitHub branching, you can follow this pattern:

### 1. **Sprint Branch Structure**

In your Jira, the sprint is identified as something like `sprint/HC-1`. The key here is that the sprint branch will group all tasks related to the sprint.

- **Sprint Branch Name**:  
  Use the following naming convention for your sprint branch:
  ```
  sprint/HC-1
  ```

This will be the main branch for the work happening in Sprint 1 (linked to Jira issue `HC-1`).

### 2. **Story Branch Structure**

Each story in the sprint is tied to a specific task and should have its own branch. Use the Jira story ID as part of your branch name. For example, if you have `HC-2` as a story, you should create a branch for that story off the sprint branch.

- **Story Branch Name**:  
  For story `HC-2`, branch off the sprint branch (`sprint/HC-1`):
  ```
  story/HC-2
  ```

This branch will contain the work for the `HC-2` story. Make sure you regularly sync this branch with the `sprint/HC-1` branch to stay up-to-date with changes made in the sprint.

### 3. **Task Branch Structure**

Tasks are smaller pieces of work that are usually created as part of a larger story. For task `HC-3`, you should create a task-specific branch off the corresponding story branch (`story/HC-2`).

- **Task Branch Name**:
  For task `HC-3`, branch off `story/HC-2`:
  ```
  task/HC-3
  ```

This will be the branch where you work on task `HC-3`.

### 4. **Development Workflow**

- **Step 1: Create Branches**
  Start by creating branches for the sprint, story, and task:

  - `sprint/HC-1` (Sprint branch)
  - `story/HC-2` (Story branch)
  - `task/HC-3` (Task branch)

  Make sure that each branch is created from the appropriate parent branch (i.e., the task branch from the story branch, and the story branch from the sprint branch).

- **Step 2: Develop in the Task Branch**

  - Work on your task `HC-3` in the `task/HC-3` branch.
  - Regularly pull changes from the `story/HC-2` branch to stay updated with any work done on the story.

- **Step 3: Merge Task Branch to Story Branch**
  Once your task `HC-3` is complete:

  - Merge `task/HC-3` into `story/HC-2`.
  - Open a Pull Request (PR) to merge `task/HC-3` into `story/HC-2` in GitHub.
  - Make sure your PR is reviewed.

- **Step 4: Merge Story Branch to Sprint Branch**
  Once the story `HC-2` is complete, merge `story/HC-2` into `sprint/HC-1`:

  - Open a PR to merge `story/HC-2` into `sprint/HC-1` on GitHub.
  - This PR will include all work related to story `HC-2` (and its tasks) and can be reviewed before being merged.

- **Step 5: Final Merge to `development`**
  Once the sprint is complete, and all stories are merged into the sprint branch (`sprint/HC-1`), it’s time to merge everything into the `development` branch:
  - Open a PR to merge `sprint/HC-1` into `development` on GitHub.
  - Review, tests, and ensure everything is working as expected before merging.

### 5. **GitHub Workflow Summary**

Here’s the sequence of branches and merges:

1. Create `sprint/HC-1` (Sprint branch)
2. Create `story/HC-2` (Story branch off `sprint/HC-1`)
3. Create `task/HC-3` (Task branch off `story/HC-2`)
4. Work on task `HC-3` in `task/HC-3` and merge it into `story/HC-2` when done.
5. Once all tasks for a story are complete, merge `story/HC-2` into `sprint/HC-1`.
6. After all stories for the sprint are done, merge `sprint/HC-1` into `development`.

### 1. _Commit Message Structure_

A typical commit message should follow this structure:

`<type>(<Jira-ID>): <short description>`

`<optional detailed explanation>`

`<optional "footer" with breaking changes or issues>`

### 2. _Commit Types (Conventional Commits)_

For better clarity and consistency, you can use Conventional Commits, which provide a standard for commit message formatting. Here’s how to use them:

- _`feat`_ – A new feature
- _`fix`_ – A bug fix
- _`docs`_ – Documentation updates
- _`style`_ – Formatting changes (code style, whitespace, etc.)
- _`refactor`_ – Code changes that neither fix a bug nor add a feature but improve the structure or design
- _`test`_ – Adding or modifying tests
- _`chore`_ – Maintenance or routine tasks (e.g., updating dependencies)
- _`build`_ – Changes that affect the build system or external dependencies
- _`ci`_ – Continuous Integration changes
- _`perf`_ – Code changes that improve performance
- _`revert`_ – Reverts a previous commit

### 3. _Commit Message Examples_

Here are some examples of well-structured commit messages for various tasks:

#### _Task-Specific Commits (Jira Integration)_

When working on a task, it’s helpful to include the task ID (e.g., `HC-3`) in the commit message to tie it back to Jira.

- _Adding new functionality:_

  feat(HC-3): implement user authentication module

- _Fixing a bug:_

  fix(HC-3): resolve login error when invalid credentials are used

- _Refactoring code (no functional changes, just structure):_

  refactor(HC-3): refactor authentication logic for readability

- _Adding tests:_

  test(HC-3): add unit tests for login functionality

- _Updating documentation:_

  docs(HC-3): update README with authentication module usage instructions

#### _Commit Messages for Merging_

When merging branches (e.g., merging task branches into story branches or story branches into sprint branches), you can use the following conventions:

- _Merging a task branch into a story branch:_

  merge(HC-2): merge task HC-3 into story HC-2

- _Merging a story branch into a sprint branch:_

  merge(HC-1): merge story HC-2 into sprint HC-1

- _Merging a sprint branch into development (final step):_

  merge(dev): merge sprint HC-1 into development

#### _Breaking Changes_

If your commit introduces a breaking change (i.e., something that will require consumers of your code to make adjustments), this should be clearly indicated in the commit message footer.

- _Example:_

  feat(HC-3): update authentication logic (BREAKING CHANGE)

  - Changed the login endpoint to require an API token instead of username/password
  - Update your API calls accordingly.

### 4. _Commit Message Guidelines_

- **Be concise but descriptive**: The subject (first line) should be short (less than 50 characters) but give enough context for the change.
- **Use the imperative mood**: Commit messages should be written as if they’re instructions for applying the change, e.g., “Add feature” or “Fix bug”.
- **Capitalize the first letter**: The first word should be capitalized for consistency.
- **Separate subject and body**: If the commit requires additional details, separate the subject line from the body with a blank line.
- **Reference Jira tickets**: Always include the Jira ID (e.g., `HC-3`) in the commit message so it can be easily linked to the corresponding Jira task.
- **Be consistent**: Stick to the same format and conventions for all commits, especially when working in a team.

### 5. _Commit Workflow Examples_

#### _Starting a Task (Creating the Task Branch)_

- **Commit 1**: Create the task branch and initialize work (no changes, just setup)

  chore(HC-3): initialize task branch for user authentication

- **Commit 2**: Implement the first part of the task (e.g., basic structure of authentication)

  feat(HC-3): add initial structure for user authentication module

#### _During Task Development_

- **Commit 3**: Adding functionality (e.g., implement login functionality)

  feat(HC-3): implement login functionality

- **Commit 4**: Fix a bug discovered during development (e.g., incorrect error message on failed login)

  fix(HC-3): correct error message on failed login attempt

#### _Finalizing the Task_

- **Commit 5**: Finalize the task and ensure it’s complete

  feat(HC-3): finalize authentication logic and cleanup

- **Commit 6**: Add tests or improve test coverage for the task

  test(HC-3): add unit tests for login validation

- **Commit 7**: Update documentation

  docs(HC-3): update README with new authentication module details

#### _Merging Task to Story_

Once the task is done, merge it into the story branch:

- **Commit 8**: Merge task `HC-3` into story `HC-2`

  merge(HC-2): merge task HC-3 into story HC-2

#### _Merging Story to Sprint_

Once the story is complete, merge it into the sprint branch:

- **Commit 9**: Merge story `HC-2` into sprint `HC-1`

  merge(HC-1): merge story HC-2 into sprint HC-1

#### _Final Merge into Development_

After the sprint is completed, merge the sprint into `development`:

- **Commit 10**: Final merge into `development`

  merge(dev): merge sprint HC-1 into development
