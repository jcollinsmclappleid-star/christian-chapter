"""Authored Chapter House for Blender 4.2 LTS.

Ivory plaster, oak, brass, evergreen planting, late-afternoon light.
Named roots only. No baked text, no people, no church-nave scenery.
"""

import math
import os
from pathlib import Path

import bpy
from mathutils import Vector


PALETTE = {
    "plaster": "#F5F0E7",
    "plaster_shadow": "#E4D8C8",
    "oak": "#6B4A32",
    "oak_dark": "#4A3224",
    "brass": "#B28A52",
    "evergreen": "#294238",
    "planting": "#82907E",
    "oxblood": "#713A40",
    "stone": "#D8CCBC",
    "path": "#D1C4B4",
    "lawn": "#6E7A68",
    "ink": "#14241F",
}


def rgba(hex_value, alpha=1.0):
    value = hex_value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4)) + (alpha,)


def make_material(name, color, roughness=0.82, metallic=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return material


def empty(name, location=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.parent = parent
    return obj


def finish_mesh(obj, material, bevel=0.03):
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        modifier = obj.modifiers.new("Soft bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        modifier.limit_method = "ANGLE"
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(material)
    return obj


def box(name, location, dimensions, material, parent=None, bevel=0.03, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    obj.parent = parent
    return finish_mesh(obj, material, bevel)


def cylinder(name, location, radius, depth, material, parent=None, vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    return finish_mesh(obj, material, 0.02)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    # Workbench is reliable in headless macOS; EEVEE Next can crash without a GPU context.
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.resolution_x = 2400
    scene.render.resolution_y = 1600
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX"


def build_house(materials):
    house = empty("ChapterHouse")
    box("Ground", (0, 0, -0.08), (22, 18, 0.16), materials["lawn"], house, 0.01)
    box("Terrace", (0, 1.2, 0.04), (14.5, 10.2, 0.1), materials["stone"], house, 0.02)

    # Blender XY ground, Z up. glTF export maps (x, y, z) -> (x, z, -y).
    # Destinations must land on the houseContent camera targets.
    threshold = empty("Threshold", (0, -8.4, 0), house)
    box("Threshold_Steps", (0, 0, 0.12), (3.4, 1.6, 0.24), materials["stone"], threshold, 0.04)
    box("Threshold_LeftPier", (-1.7, 0.2, 1.1), (0.36, 0.4, 2.1), materials["ink"], threshold)
    box("Threshold_RightPier", (1.7, 0.2, 1.1), (0.36, 0.4, 2.1), materials["ink"], threshold)
    box("Threshold_Lintel", (0, 0.2, 2.2), (3.8, 0.42, 0.28), materials["oak"], threshold)
    box("Threshold_Lamp", (0, 0.05, 2.45), (0.22, 0.22, 0.16), materials["brass"], threshold, 0.01)
    box("Threshold_MullionV", (0, 0.08, 1.35), (0.06, 0.06, 1.55), materials["oak_dark"], threshold, 0.01)
    box("Threshold_MullionH", (0, 0.08, 1.55), (0.72, 0.06, 0.06), materials["oak_dark"], threshold, 0.01)

    table = empty("Table", (-2.4, 1.2, 0), house)
    box("Table_Floor", (0, 0, 0.08), (3.6, 3.2, 0.16), materials["oak"], table)
    box("Table_Top", (0, 0, 0.78), (2.2, 1.2, 0.1), materials["oak"], table, 0.05)
    for x, y in ((-0.9, -0.4), (0.9, -0.4), (-0.9, 0.4), (0.9, 0.4)):
        box(f"Table_Leg_{x}_{y}", (x, y, 0.4), (0.12, 0.12, 0.72), materials["oak_dark"], table, 0.01)
    box("Table_Vessel", (0, 0, 0.9), (0.28, 0.28, 0.16), materials["brass"], table, 0.02)
    box("Table_LeftWall", (-1.8, -0.4, 1.1), (0.14, 2.4, 2.1), materials["plaster"], table)
    box("Table_BackWall", (0, 1.5, 1.1), (3.6, 0.14, 2.1), materials["plaster_shadow"], table)

    library = empty("Library", (2.6, 1.4, 0), house)
    box("Library_Floor", (0, 0, 0.08), (3.4, 3.0, 0.16), materials["oak"], library)
    box("Library_BackWall", (0, 1.4, 1.2), (3.3, 0.14, 2.3), materials["plaster"], library)
    for i, z in enumerate((0.7, 1.15, 1.6)):
        box(f"Library_Shelf_{i}", (0, 1.25, z), (2.8, 0.22, 0.08), materials["oak"], library, 0.015)
        for j in range(6):
            box(
                f"Library_Volume_{i}_{j}",
                (-1.1 + j * 0.38, 1.1, z + 0.18),
                (0.16, 0.12, 0.32),
                materials["oxblood" if j % 2 == 0 else "evergreen"],
                library,
                0.008,
            )

    path = empty("Path", (-3.2, -3.4, 0), house)
    box("Path_Walk", (0, 0, 0.05), (1.1, 5.2, 0.1), materials["path"], path, 0.04)
    for i, y in enumerate((-1.8, 0, 1.8)):
        cylinder(f"Path_Yew_{i}", (-0.7, y, 0.45), 0.28, 0.9, materials["planting"], path, 12)

    garden = empty("Garden", (3.1, -3.6, 0), house)
    box("Garden_Bed", (0, 0, 0.08), (3.2, 2.6, 0.16), materials["evergreen"], garden, 0.05)
    for i, (x, y) in enumerate(((-0.8, -0.4), (0.7, 0.3), (0.1, -0.7))):
        cylinder(f"Garden_Plant_{i}", (x, y, 0.42), 0.32, 0.7, materials["planting"], garden, 10)

    courtyard = empty("Courtyard", (0.1, -5.8, 0), house)
    box("Courtyard_Paving", (0, 0, 0.04), (6.4, 3.4, 0.08), materials["stone"], courtyard, 0.02)
    box("Courtyard_Basin", (0, 0, 0.22), (1.4, 1.4, 0.28), materials["brass"], courtyard, 0.06)
    cylinder("Courtyard_Water", (0, 0, 0.34), 0.48, 0.08, materials["plaster"], courtyard, 24)

    membership = empty("Membership", (5.2, -0.4, 0), house)
    box("Membership_Floor", (0, 0, 0.08), (3.0, 2.8, 0.16), materials["oak"], membership)
    box("Membership_Wall", (0, 1.2, 1.15), (2.9, 0.14, 2.2), materials["plaster"], membership)
    box("Membership_Desk", (0, 0, 0.72), (1.6, 0.7, 0.1), materials["oak"], membership, 0.04)
    box("Membership_Lamp", (0.55, 0.1, 0.92), (0.16, 0.16, 0.28), materials["brass"], membership, 0.01)

    box("House_LeftWing", (-5.6, 0.2, 1.35), (0.28, 7.4, 2.7), materials["ink"], house)
    box("House_RightWing", (6.4, 0.2, 1.35), (0.28, 7.4, 2.7), materials["ink"], house)
    box("House_Rear", (0.4, 3.4, 1.5), (12.2, 0.28, 3.0), materials["plaster_shadow"], house)
    return house


def add_light_and_camera():
    world = bpy.context.scene.world or bpy.data.worlds.new("ChapterHouseWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = rgba("#F7F3EC")
    background.inputs["Strength"].default_value = 0.55

    bpy.ops.object.light_add(type="SUN", location=(-8, -6, 14))
    sun = bpy.context.object
    sun.name = "LateAfternoon"
    sun.data.energy = 4.2
    sun.data.color = rgba("#FFF1D6")[:3]
    sun.rotation_euler = (math.radians(48), math.radians(-18), math.radians(28))

    bpy.ops.object.camera_add(location=(0.2, -11.4, 4.8))
    camera = bpy.context.object
    camera.name = "HouseCamera"
    camera.rotation_euler = (math.radians(68), 0, 0)
    bpy.context.scene.camera = camera
    return camera


def export_and_render(output_root: Path):
    output_root.mkdir(parents=True, exist_ok=True)
    blend = output_root / "chapter-house.blend"
    raw = output_root / "chapter-house.raw.glb"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    bpy.ops.export_scene.gltf(
        filepath=str(raw),
        export_format="GLB",
        export_apply=True,
        export_texcoords=False,
        export_normals=True,
        export_materials="EXPORT",
    )

    scene = bpy.context.scene
    try:
        scene.render.filepath = str(output_root / "chapter-house-desktop.png")
        bpy.ops.render.render(write_still=True)
        scene.render.resolution_x = 1170
        scene.render.resolution_y = 1560
        camera = scene.camera
        camera.location = (0, -12.4, 6.2)
        scene.render.filepath = str(output_root / "chapter-house-mobile.png")
        bpy.ops.render.render(write_still=True)
    except Exception as error:
        print("Poster render skipped:", error)


def main():
    reset_scene()
    materials = {name: make_material(name, color, 0.35 if name == "brass" else 0.82, 0.7 if name == "brass" else 0.0) for name, color in PALETTE.items()}
    build_house(materials)
    add_light_and_camera()
    output = Path(os.environ.get("CH_OUTPUT_ROOT", Path(__file__).parent / "build"))
    export_and_render(output)


if __name__ == "__main__":
    main()
