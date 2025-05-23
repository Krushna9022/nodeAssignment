const express = require("express");
const conn = require("./db");
const app = express();
//const path=require("path")
//app.use(express.static(path.join(__dirname,"public")))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.render("nav.ejs");
});



app.get("/coursemaster", (req, res) => {
  res.render("coursemaster.ejs");
});

app.get("/addcourse", (req, res) => {
  res.render("addcourse.ejs");
});
app.post("/addcourse", (req, res) => {
  const { sname, email, contact, courseId } = req.body;
  conn.query("insert into student values(0,?,?,?,?)", [sname, email, contact, courseId], (err, result) => {
    if (!err) {
      res.redirect("/addcourse")
    }
  })
});

app.get("/viewcourses", (req, res) => {
  conn.query("select * from courses", (err, result) => {
    if (!err) {
      res.render("viewCourse.ejs", { data: result });
    }
  });
});
app.get("/deletecourse", (req, res) => {
  let cid = parseInt(req.query.cid.trim());
  conn.query("delete from courses where id=?", [cid], (err, result) => {
    if (!err) {
      res.redirect("/viewcourses");
    }
  });
});
app.get("/updatecourse", (req, res) => {
  let id = parseInt(req.query.cid.trim());
  conn.query("select * from courses where id=?", [id], (err, result) => {
    if (!err) {
      res.render("updatecourse.ejs", { data: result });
    }
  });
});

app.post("/updatecourse", (req, res) => {
  const { cid, cname } = req.body;
  conn.query("update courses set cname=? where id=?", [cname, cid], (err, result) => {

    if (!err) {
      res.redirect("/viewcourses");
    } else {
      res.send("internal server error")
    }
  });


});

app.get("/studentmaster", (req, res) => {
  res.render("studentmaster.ejs");
});

app.get("/addstudent", (req, res) => {
  conn.query("select * from courses", (err, result) => {
    if (!err) {
      res.render("addstudent.ejs", { data: result })
    }
  })

})

app.post("/addstudent", (req, res) => {
  const { sname, email, contact, courseId } = req.body;
  //  console.log(courseId);
  conn.query("insert into student values(0,?,?,?,?)", [sname, email, contact, courseId], (err, result) => {
    if (!err) {
      res.redirect("/addstudent")
    }
  })
})
app.get("/viewstudents", (req, res) => {
  conn.query("select * from student", (err, result) => {
    if (!err) {
      res.render("viewstudent.ejs", { data: result })
    } else {
      res.send(err)
    }
  })
})

app.get("/deletestudent", (req, res) => {
  let did = parseInt(req.query.sid.trim())
  console.log(did)
  conn.query("delete from student where sid=?", [did], (err, result) => {
    if (err) {
      res.send("internal server err " + err)
    } else {
      res.redirect("/viewstudents")
    }
  })

})
app.get("/updatestudent", (req, res) => {
  let uid = parseInt(req.query.sid.trim())
  //console.log(uid)
  conn.query("select * from student where sid=?", [uid], (err, result) => {
    if (err) {
      res.send("internal server error ")
    } else {
      conn.query("select * from courses", (err2, cdata) => {
        if (err2) {
          res.send("internal server err2");
        }
        else {
          res.render("updatestudent.ejs", {
            data: result,
            courses: cdata
          })
        }
      })
    }

  })
})

app.post("/updatestudent", (req, res) => {
  const { sid, sname, email, contact, courseId } = req.body;
  conn.query("update student set sname=?,email=?,contact=?,cid=? where sid=?", [sname, email, contact, courseId, sid], (err, result) => {
    if (err) {
      res.send("internal server err" + err)
    } else {
      res.redirect("/viewstudents")
    }
  })
})
app.get("/report", (req, res) => {
  const selectedId = parseInt(req.query.courseId);
  
 
  conn.query("SELECT COUNT(id) AS CourseCount FROM courses", (err1, result1) => {
    if (err1) return res.status(500).send("Error fetching course count");

    const coursecount = result1[0].CourseCount;

    conn.query("SELECT COUNT(sid) AS StudentCount FROM student", (err2, result2) => {
      if (err2) return res.status(500).send("Error fetching student count");

      const studentcount = result2[0].StudentCount;

   
      conn.query("SELECT * FROM courses", (err3, allCourses) => {
        if (err3) return res.status(500).send("Error fetching courses");

        if (selectedId) {
          conn.query("SELECT * FROM student WHERE cid = ?", [selectedId], (err4, students) => {
            if (err4) return res.status(500).send("Error fetching students");

            res.render("report.ejs", {
              ccount: coursecount,
              scount: studentcount,
              courses: allCourses,
              students,
              selectedId
            });
          });
        } else {
          res.render("report.ejs", {
            ccount: coursecount,
            scount: studentcount,
            courses: allCourses,
            students: [],
            selectedId: null
          });
        }
      });
    });
  });
});


app.get("/coursewisestudent",(req,res)=>{

  conn.query("select * from course where cid=?",)
})
 
app.get("/getcoursedetail", (req, res) => {
  conn.query("select * from courses", (err, result) => {
    if (!err) {
      res.render("coursewisestudent.ejs", { data: result })
    }
  })

})
app.listen(3032, () => {
  console.log("server is started at 3032");
});
