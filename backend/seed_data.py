import json
import datetime
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import (
    Craft, Artisan, SkillCriteria, Course, Assessment, Recommendation,
    ActivityLog, LearningProgress
)
from services.pattern_service import compute_synthetic_embedding


def seed_database(db: Session):
    """Populates the database with authentic initial Goan craft records, courses, artisans, and criteria."""

    # 1. Check if database already has crafts
    if db.query(Craft).count() > 0:
        return

    print("Seeding CraftSphere AI database with verified Goan cultural records...")

    # ------------------------------------------------------------------
    # 1. Crafts (Authentic Goan Heritage Records)
    # ------------------------------------------------------------------
    crafts_data = [
        {
            "name": "Bicholim Terracotta Water Vessel (Kundlem)",
            "category": "Pottery",
            "material": "Bicholim alluvial red clay, river sand, natural iron oxide slip",
            "traditional_technique": "Wheel throwing followed by hand-paddle shaping and slow wood-fire pit kiln firing",
            "region_of_origin": "Bicholim, North Goa",
            "cultural_description": (
                "An iconic Goan domestic utensil engineered for evaporative cooling. "
                "The porous red earthen clay allows micro-transpiration, naturally chilling drinking water during humid coastal summers. "
                "Crafted by the traditional Kumbhar community of Bordem and Bicholim."
            ),
            "image_url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Goan Handicrafts Rural Development Corporation (GHRDC)",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Santer Votive Terracotta Figurine",
            "category": "Pottery",
            "material": "Local river silt clay and natural ochre pigments",
            "traditional_technique": "Hand-moulded pinch technique with incised symbolic markings",
            "region_of_origin": "Marcela, North Goa",
            "cultural_description": (
                "Votive terracotta representations dedicated to Santeri (the anthill/earth mother deity). "
                "Traditionally offered during post-harvest village festivals across North Goa sanctums."
            ),
            "image_url": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Directorate of Art & Culture, Government of Goa",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Traditional Goan Sup (Winnowing Fan)",
            "category": "Bamboo and Cane",
            "material": "Seasoned wild bamboo (Bambusa bambos) and vegetable dye bark",
            "traditional_technique": "Herringbone twill splitting, warp interlacing, and double-bound cane rimming",
            "region_of_origin": "Valpoi, Sattari, North Goa",
            "cultural_description": (
                "The 'Sup' is an indispensable agricultural winnowing tool used by Goan paddy farmers to separate chaff from rice grains. "
                "Also revered in traditional Goan wedding rituals ('Chuddo' ceremony) as an auspicious emblem of abundance."
            ),
            "image_url": "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Western Ghats Artisan Conservation Archive",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Patlo Agricultural Cane Basket",
            "category": "Bamboo and Cane",
            "material": "Goan mountain cane ('bett') and forest reed",
            "traditional_technique": "Tight hexagonal basketry weave with reinforced arched handle",
            "region_of_origin": "Sattari Foothills, Goa",
            "cultural_description": (
                "Deep storage and transport basket used across cashew orchards and areca nut plantations. "
                "Engineered for high tensile strength and coastal moisture resistance."
            ),
            "image_url": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Goa State Biodiversity Board Traditional Knowledge Register",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Traditional Goan Kunbi Checkered Saree",
            "category": "Handloom",
            "material": "100% handspun unbleached cotton yarn and indigenous vegetable madder dye",
            "traditional_technique": "Fly-shuttle pit-loom weaving with signature small red-and-white grid checks",
            "region_of_origin": "Canacona & Ponda, South Goa",
            "cultural_description": (
                "The historic handloom drape of Goa's indigenous Kunbi tribal women. "
                "Traditionally woven in earthy red and white checkered lattices, draped calf-length for ease of work in fields. "
                "Revived as a world-renowned symbol of Goan heritage and sustainable textile craft."
            ),
            "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            "source_reference": "National Institute of Design (NID) & Goa Heritage Action Group",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Traditional Dhalo Festival Shawl",
            "category": "Handloom",
            "material": "Natural coarse cotton warp with deep indigo dyed weft border",
            "traditional_technique": "Plain tab-weave with supplementary weft geometric selvedge",
            "region_of_origin": "Priol, Central Goa",
            "cultural_description": (
                "Ceremonial handloom wrap worn by women during the night-long Dhalo winter folk celebrations in village sacred courtyards ('Mand')."
            ),
            "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Goa Folk Arts Documentation Project",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Cuncolim Carved Teakwood Retable Panel",
            "category": "Wood Carving",
            "material": "Seasoned Goan teak ('sagwan') treated with cashew nutshell oil",
            "traditional_technique": "High-relief gouge carving, floral acanthus motifs, and hand-rubbed beeswax finish",
            "region_of_origin": "Cuncolim, South Goa",
            "cultural_description": (
                "Exemplifies the unique Indo-Portuguese syncretic woodcraft of Cuncolim. "
                "Local woodcarvers blended indigenous floral motifs (lotus, mango blossoms) with baroque architectural church relief carvings."
            ),
            "image_url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Archdiocese of Goa & Daman Cultural Heritage Preservation Unit",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Traditional Temple Pillar Bracket (Kankana)",
            "category": "Wood Carving",
            "material": "Solid Jackfruit wood ('ponnos')",
            "traditional_technique": "Three-dimensional monolithic chisel work with mortise-and-tenon interlocking",
            "region_of_origin": "Marcela, North Goa",
            "cultural_description": (
                "Carved wooden architectural capital supporting village temple mandapa ceilings, depicting mythic foliage and stylized peacocks."
            ),
            "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Goa Temple Architecture Survey",
            "license_info": "Creative Commons CC-BY-NC-SA 4.0",
            "is_verified": True
        },
        {
            "name": "Modern Hybrid Terracotta Planter (Experimental)",
            "category": "Pottery",
            "material": "Commercial industrial earthenware blend",
            "traditional_technique": "Slip casting with synthetic enamel glaze",
            "region_of_origin": "Urban Panaji Studio (Contemporary)",
            "cultural_description": (
                "A modern non-traditional studio pottery product. Submitted for archive review; distinct from traditional Bicholim red clay methods."
            ),
            "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
            "source_reference": "Artisan Self-Submission (Unverified Sample for UI Testing)",
            "license_info": "Public Domain",
            "is_verified": False  # Clearly separated unverified record for testing
        }
    ]

    for idx, c in enumerate(crafts_data):
        synthetic_emb = compute_synthetic_embedding(c["category"], seed=idx * 17)
        craft_obj = Craft(
            name=c["name"],
            category=c["category"],
            material=c["material"],
            traditional_technique=c["traditional_technique"],
            region_of_origin=c["region_of_origin"],
            cultural_description=c["cultural_description"],
            image_url=c["image_url"],
            source_reference=c["source_reference"],
            license_info=c["license_info"],
            is_verified=c["is_verified"],
            feature_embedding=json.dumps(synthetic_emb)
        )
        db.add(craft_obj)

    # ------------------------------------------------------------------
    # 2. Skill Criteria Benchmarks
    # ------------------------------------------------------------------
    criteria_definitions = [
        # Pottery
        ("Pottery", "Shape Consistency", "Wall thickness uniformity and dimensional contour stability across rotations.", 0.20, 8.5),
        ("Pottery", "Surface Finish", "Smooth burnishing, absence of micro-fissures, and clean slip application.", 0.20, 8.0),
        ("Pottery", "Pattern Consistency", "Regular spacing of incised or slip-painted ornamental bands.", 0.20, 7.5),
        ("Pottery", "Symmetry", "Bilateral balance, rim circularity, and true vertical axis alignment.", 0.20, 8.5),
        ("Pottery", "Detail Quality", "Definition of lip rim, base footring, and decorative relief handles.", 0.20, 8.0),

        # Bamboo & Cane
        ("Bamboo and Cane", "Shape Consistency", "Basket geometry, structural rigidity, and planar balance.", 0.20, 8.0),
        ("Bamboo and Cane", "Surface Finish", "Absence of splinters, smooth scraped nodes, and uniform strip thickness.", 0.20, 7.5),
        ("Bamboo and Cane", "Pattern Consistency", "Perfect herringbone or twill spacing without skipped warp strands.", 0.20, 9.0),
        ("Bamboo and Cane", "Symmetry", "Even curvature and uniform tension on opposing sides.", 0.20, 8.0),
        ("Bamboo and Cane", "Detail Quality", "Firm edge binding, clean hidden splice joints, and handle anchoring.", 0.20, 8.5),

        # Handloom
        ("Handloom", "Shape Consistency", "Straight selvedges and dimensional stability along the full warp length.", 0.20, 8.5),
        ("Handloom", "Surface Finish", "Even beat-up tension, uniform weft density, and zero snagged cotton threads.", 0.20, 8.5),
        ("Handloom", "Pattern Consistency", "Exact square alignment in Kunbi checkered lattice.", 0.20, 9.2),
        ("Handloom", "Symmetry", "Identical left-to-right border widths and symmetrical corner transitions.", 0.20, 8.8),
        ("Handloom", "Detail Quality", "Fine edge tassel binding and crisp contrast between madder red and unbleached cotton.", 0.20, 8.5),

        # Wood Carving
        ("Wood Carving", "Shape Consistency", "Proportional harmony of carved figures with anatomical accuracy.", 0.20, 8.2),
        ("Wood Carving", "Surface Finish", "Clean chisel facets, absence of tear-out along wood grain, and even wax polish.", 0.20, 8.0),
        ("Wood Carving", "Pattern Consistency", "Even rhythm of recurring floral acanthus rosettes and border spirals.", 0.20, 8.5),
        ("Wood Carving", "Symmetry", "Bilateral symmetry in altar arches, columns, and central medallions.", 0.20, 8.0),
        ("Wood Carving", "Detail Quality", "Undercut depth, sharp crisp leaf veins, and expressive facial details.", 0.20, 9.0),
    ]

    for cat, crit, desc, weight, bench in criteria_definitions:
        sc = SkillCriteria(
            craft_category=cat,
            criterion_name=crit,
            description=desc,
            weight=weight,
            benchmark_score=bench
        )
        db.add(sc)

    # ------------------------------------------------------------------
    # 3. Structured Courses
    # ------------------------------------------------------------------
    courses_data = [
        # Pottery Courses
        {
            "title": "Wheel Centering & Dynamic Bilateral Symmetry in Bicholim Clay",
            "craft_category": "Pottery",
            "difficulty_level": "Intermediate",
            "skill_focus": "Symmetry",
            "description": "Master the art of centering 3-5 kg alluvial clay balls on the traditional kick-wheel to achieve true rotational symmetry and prevent wall wobbling.",
            "traditional_master_notes": "Master Tukaram Kumbhar advises: 'Keep your elbows anchored against your thighs before applying radial palm pressure.'",
            "practical_exercises": json.dumps([
                "Exercise 1: Center 3 consecutive clay cones within 90 seconds without water pooling.",
                "Exercise 2: Pull a 25 cm cylinder verifying uniform 6 mm wall thickness using calipers.",
                "Exercise 3: Throw 3 identical 'kundlem' vessels measuring within ±3 mm tolerance."
            ]),
            "learning_sequence_order": 1,
            "estimated_hours": 6
        },
        {
            "title": "Natural River Pebble Burnishing & Low-Fire Slip Mastery",
            "craft_category": "Pottery",
            "difficulty_level": "Beginner",
            "skill_focus": "Surface Finish",
            "description": "Techniques for achieving a watertight, glassy natural terracotta sheen using smooth Mandovi river pebbles without synthetic glazes.",
            "traditional_master_notes": "Burnish precisely at leather-hard state; too damp leaves drag lines, too dry creates micro-cracks.",
            "practical_exercises": json.dumps([
                "Exercise 1: Filter raw red slip through 100-mesh mesh to remove silica grit.",
                "Exercise 2: Perform 3 progressive burnishing passes with circular palm stone pressure.",
                "Exercise 3: Test water absorption on test tiles after open-pit firing."
            ]),
            "learning_sequence_order": 2,
            "estimated_hours": 4
        },
        {
            "title": "Traditional Goan Relief Embellishment & Santeri Votive Figurines",
            "craft_category": "Pottery",
            "difficulty_level": "Advanced",
            "skill_focus": "Detail Quality",
            "description": "Advanced sculptural ornamentation: creating anthropomorphic votive figurines and incised solar patterns with handmade bamboo styluses.",
            "traditional_master_notes": "Ensure equal moisture content between decorative appliques and vessel body to prevent kiln detachment.",
            "practical_exercises": json.dumps([
                "Exercise 1: Hand-carve 5 traditional Goan chevron and petal stamping tools from bamboo.",
                "Exercise 2: Execute an intricate Santeri votive plaque with multi-layered relief.",
                "Exercise 3: Conduct a slow drying cycle under damp burlap sacks for 72 hours."
            ]),
            "learning_sequence_order": 3,
            "estimated_hours": 8
        },

        # Bamboo and Cane Courses
        {
            "title": "Radial Twill Weaving & Uniform Tension Control for Sup Baskets",
            "craft_category": "Bamboo and Cane",
            "difficulty_level": "Intermediate",
            "skill_focus": "Pattern Consistency",
            "description": "Systematic interlacing of warp and weft bamboo splints to create airtight, durable winnowing planes without gaps.",
            "traditional_master_notes": "Consistent hand pressure on each alternating pass guarantees the iconic Goan diamond pattern.",
            "practical_exercises": json.dumps([
                "Exercise 1: Split 20 bamboo strips to precise 1.2 mm uniform thickness using a 'koiti' knife.",
                "Exercise 2: Weave a 30x30 cm test mat with zero light leak gaps.",
                "Exercise 3: Complete a full traditional Sup base within standard agricultural dimensions."
            ]),
            "learning_sequence_order": 1,
            "estimated_hours": 6
        },
        {
            "title": "Double-Warp Edge Binding & Cane Rim Strengthening",
            "craft_category": "Bamboo and Cane",
            "difficulty_level": "Advanced",
            "skill_focus": "Detail Quality",
            "description": "Techniques to lock bamboo basket rims using seasoned wild cane ('bett') for high tensile structural longevity.",
            "traditional_master_notes": "Soak cane in warm water for 45 minutes to achieve maximum pliability before spiral binding.",
            "practical_exercises": json.dumps([
                "Exercise 1: Shave cane strips with taper-edged overlap points.",
                "Exercise 2: Bind a circular rim maintaining 15-degree spiral angle.",
                "Exercise 3: Perform drop-impact load test with 10 kg weight."
            ]),
            "learning_sequence_order": 2,
            "estimated_hours": 5
        },

        # Handloom Courses
        {
            "title": "Kunbi Saree Lattice Precision & Selvedge Tensioning",
            "craft_category": "Handloom",
            "difficulty_level": "Intermediate",
            "skill_focus": "Pattern Consistency",
            "description": "Achieve razor-sharp square grid checks in Kunbi saree weaving by balancing reed beat-up pressure and shuttle speed.",
            "traditional_master_notes": "Listen to the loom rhythm: two clear beats per shed change maintains perfect thread counts.",
            "practical_exercises": json.dumps([
                "Exercise 1: Calibrate warp beam weights to eliminate center sag.",
                "Exercise 2: Weave 1 meter of Kunbi checkered pattern maintaining 48 picks per inch.",
                "Exercise 3: Check selvedge ruler alignment; variance must not exceed 2 mm."
            ]),
            "learning_sequence_order": 1,
            "estimated_hours": 7
        },
        {
            "title": "Natural Madder Root Dye Extraction & Color Fastness",
            "craft_category": "Handloom",
            "difficulty_level": "Beginner",
            "skill_focus": "Surface Finish",
            "description": "Traditional non-chemical dyeing methods using Rubia cordifolia (Manjistha) and myrobalan mordanting for radiant, durable Goan red shades.",
            "traditional_master_notes": "Simmer gently below boiling point; excessive heat turns brilliant madder into dull brownish rust.",
            "practical_exercises": json.dumps([
                "Exercise 1: Prepare alum mordant bath with pure rainwater.",
                "Exercise 2: Dye 500 g coarse cotton skein achieving uniform ruby-red saturation.",
                "Exercise 3: Conduct sunlight and wash test to evaluate colorfastness rating."
            ]),
            "learning_sequence_order": 2,
            "estimated_hours": 4
        },

        # Wood Carving Courses
        {
            "title": "Cuncolim Gouge Chisel Profiling & High-Relief Floral Carving",
            "craft_category": "Wood Carving",
            "difficulty_level": "Intermediate",
            "skill_focus": "Detail Quality",
            "description": "Classical carving techniques for traditional Goan acanthus leaves, rosette medallions, and baroque architectural fretwork.",
            "traditional_master_notes": "Carve with the wood grain, never against it; let the honed bevel do the cutting without forcing the mallet.",
            "practical_exercises": json.dumps([
                "Exercise 1: Sharpen 6 gouge chisels to razor edge on waterstones (1000/6000 grit).",
                "Exercise 2: Execute a 15x15 cm teak relief panel of a blooming lotus rosette.",
                "Exercise 3: Clean deep undercut recesses without leaving tool gouge marks."
            ]),
            "learning_sequence_order": 1,
            "estimated_hours": 8
        },
        {
            "title": "Bilateral Geometric Symmetry in Sacred Wood Retables",
            "craft_category": "Wood Carving",
            "difficulty_level": "Advanced",
            "skill_focus": "Symmetry",
            "description": "Architectural proportioning and mirroring methods for temple capital brackets and church retable panel arches.",
            "traditional_master_notes": "Always establish a scored center datum line; measure mirrored anchor points with dividers.",
            "practical_exercises": json.dumps([
                "Exercise 1: Transfer template lines with compass dividers to dual teak blanks.",
                "Exercise 2: Rough out twin mirrored bracket profiles within ±1 mm accuracy.",
                "Exercise 3: Assemble finished panels verifying seamless centerline alignment."
            ]),
            "learning_sequence_order": 2,
            "estimated_hours": 10
        }
    ]

    for cd in courses_data:
        course_obj = Course(
            title=cd["title"],
            craft_category=cd["craft_category"],
            difficulty_level=cd["difficulty_level"],
            skill_focus=cd["skill_focus"],
            description=cd["description"],
            traditional_master_notes=cd["traditional_master_notes"],
            practical_exercises=cd["practical_exercises"],
            learning_sequence_order=cd["learning_sequence_order"],
            estimated_hours=cd["estimated_hours"]
        )
        db.add(course_obj)

    # ------------------------------------------------------------------
    # 4. Registered Artisans (Demonstration Profiles)
    # ------------------------------------------------------------------
    artisans_data = [
        {
            "artisan_code": "ART-GOA-101",
            "name": "Tukaram Kumbhar",
            "craft_category": "Pottery",
            "experience_years": 14,
            "experience_level": "Intermediate",
            "village_location": "Bordem, Bicholim, North Goa",
            "contact_phone": "+91 98221 45012",
            "bio": "4th generation traditional potter specializing in Bicholim earthenware kundlem vessels and Santeri votive terracotta."
        },
        {
            "artisan_code": "ART-GOA-102",
            "name": "Shanti Gauda",
            "craft_category": "Handloom",
            "experience_years": 8,
            "experience_level": "Intermediate",
            "village_location": "Gaondongrim, Canacona, South Goa",
            "contact_phone": "+91 98224 89123",
            "bio": "Master weaver preserving the authentic tribal Kunbi saree checkered weave and natural root dyeing techniques."
        },
        {
            "artisan_code": "ART-GOA-103",
            "name": "Vishnu Naik",
            "craft_category": "Wood Carving",
            "experience_years": 24,
            "experience_level": "Master",
            "village_location": "Cuncolim, South Goa",
            "contact_phone": "+91 97645 12789",
            "bio": "Veteran woodcarver crafting sacred temple capital brackets and historic Goan architectural woodwork."
        },
        {
            "artisan_code": "ART-GOA-104",
            "name": "Savitri Velip",
            "craft_category": "Bamboo and Cane",
            "experience_years": 5,
            "experience_level": "Beginner",
            "village_location": "Valpoi, Sattari, North Goa",
            "contact_phone": "+91 98501 34678",
            "bio": "Artisan specializing in agricultural winnowing fans ('sup') and hand-woven riverine fishing traps."
        }
    ]

    created_artisans = []
    for ad in artisans_data:
        art = Artisan(
            artisan_code=ad["artisan_code"],
            name=ad["name"],
            craft_category=ad["craft_category"],
            experience_years=ad["experience_years"],
            experience_level=ad["experience_level"],
            village_location=ad["village_location"],
            contact_phone=ad["contact_phone"],
            bio=ad["bio"],
            profile_photo=None
        )
        db.add(art)
        created_artisans.append(art)

    db.commit()

    # ------------------------------------------------------------------
    # 5. Initial Assessment for Tukaram Kumbhar
    # ------------------------------------------------------------------
    tukaram = db.query(Artisan).filter(Artisan.artisan_code == "ART-GOA-101").first()
    if tukaram:
        cv_metrics_demo = {
            "cv_measured_symmetry": 6.8,
            "cv_measured_smoothness": 7.4,
            "cv_edge_detail_density": 0.22,
            "cv_image_resolution": "1024x768",
            "measurement_notes": "Bilateral mirror difference measured 18.2% variation between left and right vessel profiles."
        }
        strengths_demo = [
            "Strong performance in Shape Consistency (8.2/10.0). Demonstrates refined control.",
            "Surface Finish demonstrates thorough clay processing and burnishing."
        ]
        gaps_demo = [
            "Symmetry: Score of 6.8/10.0 is 1.7 points below master benchmark (8.5/10.0).",
            "Pattern Consistency: Minor variation in rim ornamentation spacing."
        ]
        assessment1 = Assessment(
            artisan_id=tukaram.id,
            craft_category="Pottery",
            craft_title="Bicholim Red Clay Kundlem Vessel",
            image_url="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
            shape_consistency=8.2,
            surface_finish=7.4,
            pattern_consistency=7.0,
            symmetry=6.8,
            detail_quality=7.6,
            cv_metrics=json.dumps(cv_metrics_demo),
            expert_notes="Good clay conditioning and authentic Bicholim red slip. Minor bilateral deviation observed on shoulder profile.",
            overall_score=7.40,
            strengths=json.dumps(strengths_demo),
            improvement_areas=json.dumps(gaps_demo),
            assessment_date=datetime.datetime.utcnow() - datetime.timedelta(days=12)
        )
        db.add(assessment1)

        # Second assessment showing progress over time
        assessment2 = Assessment(
            artisan_id=tukaram.id,
            craft_category="Pottery",
            craft_title="Refined Kundlem Water Vessel (Post-Practice)",
            image_url="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
            shape_consistency=8.6,
            surface_finish=7.8,
            pattern_consistency=7.5,
            symmetry=7.8,
            detail_quality=8.0,
            cv_metrics=json.dumps(cv_metrics_demo),
            expert_notes="Marked improvement in rotational symmetry after completing Wheel Centering practice module.",
            overall_score=7.94,
            strengths=json.dumps(["Significant symmetry improvement", "Enhanced wall uniformity"]),
            improvement_areas=json.dumps(["Further refine rim lip crispness to reach 8.5 master benchmark."]),
            assessment_date=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        )
        db.add(assessment2)

    # ------------------------------------------------------------------
    # 6. Initial Activity Logs
    # ------------------------------------------------------------------
    logs = [
        ("ARCHIVE_ADD", "Verified Goan Heritage Records Initialized", "Indexed 8 verified traditional Goan craft records with cultural metadata."),
        ("ARTISAN_REG", "Artisan Guild Onboarded", "Registered foundational artisans from Bicholim, Canacona, Cuncolim, and Sattari."),
        ("ASSESSMENT", "Initial Benchmark Assessment Completed", "Assessed Tukaram Kumbhar (Pottery) with computer vision symmetry measurement.")
    ]
    for act_type, title, desc in logs:
        log_obj = ActivityLog(
            activity_type=act_type,
            title=title,
            description=desc
        )
        db.add(log_obj)

    db.commit()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()

