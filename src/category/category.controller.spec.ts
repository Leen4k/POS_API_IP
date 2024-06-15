import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: JwtService, useValue: mockJwtService },
        Reflector,
        RolesGuard,
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = {
      id: '1',
      name: 'Test Category',
      photo: 'photo-url',
    };
    const result = { id: '1', ...createCategoryDto };
    (service.create as jest.Mock).mockResolvedValue(result);

    expect(await controller.create(createCategoryDto)).toEqual({
      message: 'Category created successfully',
      data: result,
    });
    expect(service.create).toHaveBeenCalledWith(createCategoryDto);
  });

  // More tests for findAll, findOne, update, remove...
});
