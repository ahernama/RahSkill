const LAUNCH_TONES = ["<audio src=\"soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01\"/>"];
const RIGHT_SOUNDS = ["<audio src=\"soundbank://soundlibrary/gameshow/gameshow_01\"/>",
"<audio src=\"soundbank://soundlibrary/musical/amzn_sfx_bell_med_chime_02\"/>"];
const WRONG_SOUNDS = ["<audio src=\"soundbank://soundlibrary/musical/amzn_sfx_buzzer_small_01\"/>",
"<audio src=\"soundbank://soundlibrary/gameshow/gameshow_03\"/>",
"<audio src=\"soundbank://soundlibrary/buzzers_pistols/buzzers_pistols_01\"/>"];

const sfx = {
    launchTones:LAUNCH_TONES,
    rightSounds:RIGHT_SOUNDS,
    wrongSounds:WRONG_SOUNDS,
};

module.exports = sfx;