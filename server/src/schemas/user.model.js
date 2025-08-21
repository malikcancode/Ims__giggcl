import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAACUCAMAAAA9M+IXAAAAOVBMVEVRUVEAAABUVFROTk4yMjJAQEBHR0dEREQ8PDwRERELCwtLS0ssLCwdHR0EBAQhISEXFxc3NzcnJyez233BAAAERUlEQVR4nO2c23KrMAxFQQaMMff//9hjSJuGFChY8jY5w3ro9HGPRuhmKUlyc3Nzc3Nzc3Pz/0FE8x+a/7k0TqHV+ZDNDKUukgtLpkTXXW+q9IvWmGYc7BWtTKTKLl3FZM7IsfUtoKTIqnWxs5nHXF1IMBW12RY7UXX5ZSys9iz7tHBXXEIvlX9Y9kkW3yNIZQfFOjodWS/ZjXCwTpVH1Uv6gNcuHSKm3Pys2jStVTy1Rz+yhd5I/kC69VDr/CGKXir81MbxX7KNp9o48aH2Vev0wj83GvzVpmmPNq/lqE3TAauXRp7c3kLVeuSHJTVSrjpVKayCLCdzttp0xMklvnHTFFb8UiGgFlc7cMPCgx6VK5RPIfYLVCqm3Le2WYKKZYxq4ZUGkyoEgu5MW0DkFiKum4IKBxLIEQ8gmYJXOr6CKSNPzEH2aRFqE5EkMYPIw8q7R/uF/Sy5iJGZ6j9KrpUKux8nF1HkfJgzCH5qkH5NLu4iAplU/ehA9BMkloQNpGYopeR2kIrs9HvEFpi5tP9g9w2NUCsWGnpIYEiolOmER4RYh5VxXtSMV2REhhvxyjSXwBGkRFGGe86WaIYxKe2BQOjNcWoFzNsB1TrzMmt08MMlaZ5c9LM7sape2OT8CasHwr9hk/YPvjE2GvwrHeiL5Y9ez2jWxdnGIb8m08RbfvPoMpuYq3rDWf8dMS3EFuW5Uj3iFtkM6RPpuBriik3mD+6ogS+yEpsfaoZM1PXHV9SBjFFDt2/2oaRs9hSbOm5AeIec4HrjozPzMUJshe9QYlcUV2NZxN/h3sBJ1kM99r0xpm/GLLfJZRb616EFsdXcRIKSHwcguvIt1eyyyuq8/Dr+yobp/Esll3Rfp0kPY/Ny++Voqzk2qIspnuJtt1PlNFlxiWg2HylOWv+sF/pMXyFVTOd/x8pdl9xiCybSe07wRttnMV3CWfbsHKcdohWRpGuPqUg/RLEwJUcOANeIcLJGlDPGuzXYwKcOAFdoQI+rM4os95HVAI88+CcT6fS+ihIss7DZQ744rtv+YAADdJLZ6Z+pwttXyal1Oa4Mq5dE1U45Oahe3tvUGiWFq4Tl1U5vl8EMLLY+ttAbSCydHJMfxISJD1QEUevyRRjnlVluWiHIK5v8Z/YkwIur0ObYKq24+4pd+awifpMtdEK1hWw5SWIbsBuIVg8kuMq/geihXcCo8I3ghoPYdvEecu+ZslXjBlJ73dwNrKMI9UIkd4Oyi0wuljus/IO2FJEL8dwJkaUXiRnIQSS8FxBzv2n4csMntBfYsVfuvOcI/GV0pHFTw7x5R6WIb5hjkgCThV2YqULmVy5OwBqry116HYXVZWLjwkTPsa7Ur1ycgLO+Fbb/XYURG4J3lCtwEjHcdV2mYPSYoML8lfMt/HMFTOHVTqHs+AKaSyrKWls8NoDGqgo4GVuhrSrTZUOZ68Ja5fgl8B85dzgORnPmRwAAAABJRU5ErkJggg==",
    },
    forgetPasswordToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
