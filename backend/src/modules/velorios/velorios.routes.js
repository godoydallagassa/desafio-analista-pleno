const { Router } = require("express");
const veloriosController = require("./velorios.controller");
const bannerService = require("../../pdf/banner.service");

const router = Router();

router.get("/velorios", veloriosController.listar);
router.get("/velorios/:id/banner", bannerService.gerarBanner);

module.exports = router;