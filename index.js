import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import fs from "fs";

const git = simpleGit();
const path = "./data.json";

const makeCommits = async (n) => {
  if (n <= 0) {
    console.log("Done committing.");
    return git.push();
  }

  const x = Math.floor(Math.random() * 55); // weeks
  const y = Math.floor(Math.random() * 7);  // days

  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date };

  console.log(`Committing on ${date}`);

  jsonfile.writeFile(path, data, async (err) => {
    if (err) {
      console.error("Failed to write file:", err);
      return;
    }

    try {
      await git.add([path]);
      await git.commit(date, undefined, { "--date": date });
      makeCommits(n - 1);
    } catch (e) {
      console.error("Git operation failed:", e);
    }
  });
};

makeCommits(100);
