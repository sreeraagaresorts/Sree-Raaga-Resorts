const db = require("../config/db");

exports.getRooms = async (req, res) => {
  try {

    const [rooms] = await db.query(
      "SELECT * FROM rooms ORDER BY id DESC"
    );

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed To Fetch Rooms"
    });
  }
};

exports.getRoom = async (req, res) => {

  try {

    const [room] = await db.query(
      "SELECT * FROM rooms WHERE id=?",
      [req.params.id]
    );

    if (room.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room Not Found"
      });
    }

    res.json({
      success: true,
      data: room[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.createRoom = async (req, res) => {

  try {

    const {
      name,
      price,
      area,
      beds,
      bathrooms,
      description
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const [result] = await db.query(
      `INSERT INTO rooms
      (
        name,
        price,
        image,
        area,
        beds,
        bathrooms,
        description
      )
      VALUES(?,?,?,?,?,?,?)`,
      [
        name,
        price,
        image,
        area,
        beds,
        bathrooms,
        description
      ]
    );

    res.status(201).json({
      success: true,
      message: "Room Created",
      roomId: result.insertId
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Room Creation Failed"
    });
  }
};

exports.updateRoom = async (req, res) => {

  try {

    const {
      name,
      price,
      area,
      beds,
      bathrooms,
      description
    } = req.body;

    let imageQuery = "";
    let values = [
      name,
      price,
      area,
      beds,
      bathrooms,
      description
    ];

    if (req.file) {

      imageQuery = ", image=?";

      values.push(req.file.filename);
    }

    values.push(req.params.id);

    await db.query(
      `UPDATE rooms
       SET
       name=?,
       price=?,
       area=?,
       beds=?,
       bathrooms=?,
       description=?
       ${imageQuery}
       WHERE id=?`,
      values
    );

    res.json({
      success: true,
      message: "Room Updated"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update Failed"
    });
  }
};


exports.deleteRoom = async (req, res) => {

  try {

    await db.query(
      "DELETE FROM rooms WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Room Deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete Failed"
    });
  }
};