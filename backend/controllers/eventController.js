const db = require("../config/db");

exports.getEvents = async (req, res) => {
  try {

    const [events] = await db.query(
      "SELECT * FROM events ORDER BY id DESC"
    );

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed To Fetch Events"
    });
  }
};

exports.getEvent = async (req, res) => {

  try {

    const [event] = await db.query(
      "SELECT * FROM events WHERE id=?",
      [req.params.id]
    );

    if (event.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event Not Found"
      });
    }

    res.json({
      success: true,
      data: event[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.createEvent = async (req, res) => {

  try {

    const {
      name,
      category,
      event_date,
      description
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const [result] = await db.query(
      `INSERT INTO events
      (
        name,
        category,
        image,
        event_date,
        description
      )
      VALUES(?,?,?,?,?)`,
      [
        name,
        category,
        image,
        event_date,
        description
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event Created",
      eventId: result.insertId
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Event Creation Failed"
    });
  }
};

exports.updateEvent = async (req, res) => {

  try {

    const {
      name,
      category,
      event_date,
      description
    } = req.body;

    let imageQuery = "";

    let values = [
      name,
      category,
      event_date,
      description
    ];

    if (req.file) {

      imageQuery = ", image=?";

      values.push(req.file.filename);
    }

    values.push(req.params.id);

    await db.query(
      `UPDATE events
       SET
       name=?,
       category=?,
       event_date=?,
       description=?
       ${imageQuery}
       WHERE id=?`,
      values
    );

    res.json({
      success: true,
      message: "Event Updated"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update Failed"
    });
  }
};


exports.deleteEvent = async (req, res) => {

  try {

    await db.query(
      "DELETE FROM events WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Event Deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete Failed"
    });
  }
};